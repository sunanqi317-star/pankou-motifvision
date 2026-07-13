# Pankou MotifVision

**Visual Transformer-Based Motif Retrieval and Propagation Prototype for Haipai Pankou**

A machine-vision-oriented digital art history research prototype exploring visual motif retrieval, similarity analysis, and motif propagation in Haipai Pankou images.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4

## Getting Started

```bash
cd pankou-motifvision
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
  components/     # UI sections
  data/           # Mock Pankou corpus (30 specimens)
  utils/
    embeddings.ts # CLIP-ready embedding interface (mock)
    search.ts     # Text/image retrieval logic
  types/          # TypeScript interfaces
```

## CLIP Integration

Replace mock encoders in `src/utils/embeddings.ts`:

- `encodeText(query)` -> CLIP text encoder
- `encodeImageItem(item)` -> CLIP image encoder

Search functions in `src/utils/search.ts` consume embeddings via cosine similarity and require no other changes.

## License

Research prototype - portfolio demonstration.
