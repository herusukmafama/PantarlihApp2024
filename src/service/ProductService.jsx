export const ProductService = {
    async getProducts() {
        const response = await fetch("https://localhost:44313/idcen/DataWarga/getList");
        const getList = await response.json();
        console.log(getList.data);
        
        return getList.data;
    }
};