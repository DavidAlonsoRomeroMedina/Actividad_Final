const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar');
const resultado = document.getElementById('resultado');

function mod(n) { return (n % 26 + 26) % 26; }

// Contador de caracteres
mensaje.addEventListener('input', () => {
    charCount.textContent = `${mensaje.value.length}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz numérica del mensaje
function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!texto) return matrizMensaje.textContent = 'Escribe un mensaje primero...';

    let valores = texto.split('').map(c => c.charCodeAt(0) - 65);
    if (valores.length % 2 !== 0) valores.push(23); // X

    let muestra = '[';
    for (let i = 0; i < valores.length; i += 2)
        muestra += `[${valores[i]}, ${valores[i+1]}] `;
    matrizMensaje.textContent = muestra + ']';
}

// Inversa de la matriz clave
function inversaClave(key) {
    let det = mod(key[0][0] * key[1][1] - key[0][1] * key[1][0]);
    if (det === 0) return null;

    let invDet = null;
    for (let i = 1; i < 26; i++) if (mod(det * i) === 1) invDet = i;
    if (invDet == null) return null;

    return [
        [mod(invDet * key[1][1]), mod(invDet * -key[0][1])],
        [mod(invDet * -key[1][0]), mod(invDet * key[0][0])]
    ];
}

// ENCRIPTAR
btnEncriptar.addEventListener('click', () => {
    const key = [
        [parseInt(k11.value), parseInt(k12.value)],
        [parseInt(k21.value), parseInt(k22.value)]
    ];

    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!texto) return resultado.textContent = 'Error: Ingresa un mensaje';

    let numeros = texto.split('').map(c => c.charCodeAt(0) - 65);
    if (numeros.length % 2 !== 0) numeros.push(23);

    let salida = "";
    for (let i = 0; i < numeros.length; i += 2) {
        let c1 = mod(key[0][0]*numeros[i] + key[0][1]*numeros[i+1]);
        let c2 = mod(key[1][0]*numeros[i] + key[1][1]*numeros[i+1]);
        salida += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
    }
    resultado.textContent = salida;
});

// DESENCRIPTAR
btnDesencriptar.addEventListener('click', () => {
    const key = [
        [parseInt(k11.value), parseInt(k12.value)],
        [parseInt(k21.value), parseInt(k22.value)]
    ];

    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!texto) return resultado.textContent = 'Error: Ingresa un mensaje encriptado';

    const invKey = inversaClave(key);
    if (!invKey) return resultado.textContent = 'Error: matriz no invertible. No se puede desencriptar.';

    let numeros = texto.split('').map(c => c.charCodeAt(0) - 65);

    let salida = "";
    for (let i = 0; i < numeros.length; i += 2) {
        let p1 = mod(invKey[0][0]*numeros[i] + invKey[0][1]*numeros[i+1]);
        let p2 = mod(invKey[1][0]*numeros[i] + invKey[1][1]*numeros[i+1]);
        salida += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
    }
    resultado.textContent = salida;
});

// Modo oscuro
document.getElementById('toggleDarkMode').addEventListener('click', () =>
    document.body.classList.toggle('dark-mode')
);
