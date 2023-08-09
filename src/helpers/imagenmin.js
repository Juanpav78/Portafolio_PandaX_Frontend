import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['../assets/**/*.{jpg,png}'], {
	destination: '../build/images',
	plugins: [
		imageminWebp({quality: 50})
	]
});

console.log('Images optimized');