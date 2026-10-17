import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(dir, '../assets');
const destination = path.join(dir, '../build/images');

await mkdir(destination, { recursive: true });

const files = (await readdir(assets, { recursive: true }))
	.filter(file => /\.(jpe?g|png)$/i.test(file));

// Genera una copia .webp de cada PNG/JPG de src/assets en src/build/images (mismo nombre).
// Hay que volver a ejecutarlo (npm run optimize:images) cada vez que se cambia una imagen:
// el navegador carga el .webp, así que si no se regenera seguiría mostrando la versión vieja.
await Promise.all(files.map(file => {
	const { name } = path.parse(file);
	return sharp(path.join(assets, file))
		// Ninguna imagen del sitio se muestra a más de ~1000 px de ancho (incluido retina);
		// withoutEnlargement evita agrandar las que ya son más pequeñas
		.resize({ width: 1000, withoutEnlargement: true })
		// Calidad 75: con 50 se veían artefactos en bordes de fotos con fondo transparente
		.webp({ quality: 75 })
		.toFile(path.join(destination, `${name}.webp`));
}));

console.log('Images optimized');
