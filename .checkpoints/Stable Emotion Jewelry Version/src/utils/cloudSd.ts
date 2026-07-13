export type CloudSdStatus =
  | 'not_configured'
  | 'ready'
  | 'generating'
  | 'generated'
  | 'error';

export interface CloudSdRequest {
  positivePrompt: string;
  negativePrompt: string;
  imageSize: string;
  cfgScale: number;
  steps: number;
  loraWeight: number;
}

export interface CloudSdResult {
  imageDataUrl: string;
  summary: string;
}

export function getCloudSdEndpoint(): string | undefined {
  const endpoint = import.meta.env.VITE_CLOUD_SD_ENDPOINT?.trim();
  return endpoint || undefined;
}

function parseImageSize(imageSize: string): { width: number; height: number } {
  const [width, height] = imageSize.split('x').map((value) => Number.parseInt(value, 10));
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return { width: 1024, height: 1024 };
  }
  return { width, height };
}

function toDataUrl(value: string): string {
  if (value.startsWith('data:')) return value;
  return `data:image/png;base64,${value}`;
}

function extractImageFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;

  if (typeof data.image_url === 'string') return data.image_url;
  if (typeof data.imageUrl === 'string') return data.imageUrl;

  const images = data.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') return toDataUrl(first);
    if (first && typeof first === 'object') {
      const imageObj = first as Record<string, unknown>;
      if (typeof imageObj.url === 'string') return imageObj.url;
      if (typeof imageObj.data === 'string') return toDataUrl(imageObj.data);
    }
  }

  if (typeof data.image === 'string') return toDataUrl(data.image);
  if (typeof data.output === 'string') return toDataUrl(data.output);

  return null;
}

export async function generateCloudSdImage(
  endpoint: string,
  request: CloudSdRequest,
): Promise<CloudSdResult> {
  const { width, height } = parseImageSize(request.imageSize);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.positivePrompt,
      negative_prompt: request.negativePrompt,
      width,
      height,
      cfg_scale: request.cfgScale,
      steps: request.steps,
      lora_weight: request.loraWeight,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Cloud SD request failed (${response.status})`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('image/')) {
    const blob = await response.blob();
    const imageDataUrl = URL.createObjectURL(blob);
    return {
      imageDataUrl,
      summary: `${width}x${height}, CFG ${request.cfgScale}, ${request.steps} steps`,
    };
  }

  const payload: unknown = await response.json();
  const image = extractImageFromPayload(payload);
  if (!image) {
    throw new Error('Cloud SD response did not include an image.');
  }

  return {
    imageDataUrl: image,
    summary: `${width}x${height}, CFG ${request.cfgScale}, ${request.steps} steps`,
  };
}

export function downloadGeneratedImage(imageDataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = imageDataUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
