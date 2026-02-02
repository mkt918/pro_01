/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.js",
        "./algorithms/*.js"
    ],
    theme: {
        extend: {
            colors: {
                'bg-custom': '#0f0c29',
                'primary': '#00d2ff',
                'secondary': '#3a7bd5',
                'accent': '#ff0076',
                'sorted-green': '#00ff87',
            }
        },
    },
    plugins: [],
}
