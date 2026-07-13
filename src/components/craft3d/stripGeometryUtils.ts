import * as THREE from 'three';

/** Gentle bow along strip length — subtle textile softness. */
export function applySubtleStripBow(
  geometry: THREE.BufferGeometry,
  halfLength: number,
  bowAmount = 0.011,
): void {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const along = vertex.x / halfLength;
    const lift = bowAmount * (1 - along * along);
    position.setY(i, vertex.y + lift);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

/** Top lighter, sides and ends darker for visible fabric thickness. */
export function applyStripFaceShading(shader: THREE.WebGLProgramParametersWithUniforms): void {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    `#include <color_fragment>
    vec3 n = normalize(vNormal);
    float topFace = smoothstep(0.42, 0.84, n.y);
    float sideFace = (1.0 - topFace) * smoothstep(0.08, 0.52, abs(n.z));
    float endFace = (1.0 - topFace) * smoothstep(0.42, 0.88, abs(n.x));
    diffuseColor.rgb *= mix(0.88, 1.1, topFace);
    diffuseColor.rgb *= mix(1.0, 0.82, sideFace);
    diffuseColor.rgb *= mix(1.0, 0.84, endFace);
    `,
  );
}
