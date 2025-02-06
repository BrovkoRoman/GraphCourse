export const toBase64 = file => new Promise((resolve, reject) => {
    console.log("toBase64");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});