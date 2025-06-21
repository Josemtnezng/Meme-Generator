document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const memeSelect = document.getElementById('meme-select');
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');

    let memes = [];
    let selectedMemeUrl = '';

    // Función principal para generar el meme en el canvas
    function generarMeme() {
        if (!selectedMemeUrl) return;

        const img = new Image();
        img.crossOrigin = 'anonymous'; // Necesario para evitar problemas de CORS al usar imágenes de otra URL
        img.src = selectedMemeUrl;

        // Cuando la imagen se cargue, la dibujamos en el canvas
        img.onload = () => {
            // Ajustar el tamaño del canvas a la imagen
            canvas.width = img.width;
            canvas.height = img.height;

            // Dibujar la imagen de fondo
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Estilo del texto
            const fontSize = canvas.width / 10;
            ctx.font = `${fontSize}px Anton`;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = fontSize / 20;
            ctx.textAlign = 'center';

            // Dibujar texto de arriba
            const topText = topTextInput.value.toUpperCase();
            ctx.fillText(topText, canvas.width / 2, fontSize * 1.2);
            ctx.strokeText(topText, canvas.width / 2, fontSize * 1.2);

            // Dibujar texto de abajo
            const bottomText = bottomTextInput.value.toUpperCase();
            ctx.fillText(bottomText, canvas.width / 2, canvas.height - (fontSize * 0.4));
            ctx.strokeText(bottomText, canvas.width / 2, canvas.height - (fontSize * 0.4));
        };
    }

    // Cargar las plantillas de memes desde la API
    async function cargarPlantillas() {
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            const json = await response.json();
            memes = json.data.memes;

            // Limpiar el selector y añadir las nuevas opciones
            memeSelect.innerHTML = '<option value="">Elige una plantilla...</option>';
            memes.forEach(meme => {
                const option = document.createElement('option');
                option.value = meme.url;
                option.textContent = meme.name;
                memeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar las plantillas:', error);
            memeSelect.innerHTML = '<option>Error al cargar plantillas</option>';
        }
    }

    // Event Listeners
    memeSelect.addEventListener('change', (e) => {
        selectedMemeUrl = e.target.value;
        generarMeme();
    });

    topTextInput.addEventListener('input', generarMeme);
    bottomTextInput.addEventListener('input', generarMeme);

    downloadBtn.addEventListener('click', () => {
        // Crear un enlace temporal para descargar la imagen del canvas
        const link = document.createElement('a');
        link.download = 'mi-meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Iniciar la carga de plantillas al cargar la página
    cargarPlantillas();
});