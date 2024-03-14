import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

export default function ProductsDemo() {
    let emptyProduct = {
        dw_id: '',
        dw_no_kk: '',
        dw_nik: '',
        dw_nama_lengkap: '',
        dw_jenis_kelamin: '',
        dw_alamat: '',
        dw_no_hp: '',
        dw_ktp: '',
        dw_user_submit: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    // const saveProductBackup = () => {
    //     debugger
    //     setSubmitted(true);

    //     if (product.dw_nama_lengkap.trim()) {
    //         let _products = [...products];
    //         let _product = { ...product };

    //         if (product.dw_id) {
    //             const index = findIndexById(product.dw_id);

    //             _products[index] = _product;
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 6000 });
    //         } else {
    //             _product.dw_id = createId();
    //             //_product.image = 'product-placeholder.svg';
    //             _products.push(_product);
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 6000 });
    //         }

    //         setProducts(_products);
    //         setProductDialog(false);
    //         setProduct(emptyProduct);
    //     }
    // };

    const saveProduct = async () => {
        debugger
        setSubmitted(true);

        // data to be sent to the POST request
        let _data = { ...product };

        const rawResponse = await fetch('https://localhost:44313/idcen/DataWarga/insert', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(_data)
        });
        const content = await rawResponse.json();

        const responseInsert = content;
        console.log(responseInsert);

        if(responseInsert.status === "Success"){
            toast.current.show({ severity: 'success', summary: responseInsert.status, detail: 'Data Warga has been Inserted', life: 6000 });
            
            setProductDialog(false);
            setProduct(emptyProduct);
            ProductService.getProducts().then((data) => setProducts(data));
        }else{
            toast.current.show({ severity: 'error', summary: responseInsert.status, detail: responseInsert.message, life: 6000 });
        }

    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 6000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 6000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['dw_jenis_kelamin'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    {/* <Column selectionMode="multiple" exportable={false}></Column> */}
                    <Column field="dw_id" header="ID" sortable style={{ minWidth: '3rem' }}></Column>
                    <Column field="dw_nama_lengkap" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    {/* <Column field="dw_nik" header="Image" body={imageBodyTemplate}></Column> */}
                    <Column field="dw_no_kk" header="No. KK" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="dw_nik" header="NIK KTP" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="dw_jenis_kelamin" header="Jenis Kelamin" sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="dw_alamat" header="Alamat" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column field="dw_alamat" header="Alamat" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_nama_lengkap" className="font-bold">
                        Nama Lengkap
                    </label>
                    <InputText id="dw_nama_lengkap" value={product.dw_nama_lengkap} onChange={(e) => onInputChange(e, 'dw_nama_lengkap')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.dw_nama_lengkap })} />
                    {submitted && !product.dw_nama_lengkap && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_no_kk" className="font-bold">
                        No KK
                    </label>
                    <InputText id="dw_no_kk" value={product.dw_no_kk} onChange={(e) => onInputChange(e, 'dw_no_kk')} required className={classNames({ 'p-invalid': submitted && !product.dw_no_kk })} />
                    {submitted && !product.dw_no_kk && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_nik" className="font-bold">
                        NIK KTP
                    </label>
                    <InputText id="dw_nik" value={product.dw_nik} onChange={(e) => onInputChange(e, 'dw_nik')} required className={classNames({ 'p-invalid': submitted && !product.dw_nik })} />
                    {submitted && !product.dw_nik && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label className="mb-3 font-bold">Jenis Kelamin</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="dw_jenis_kelamin" value="L" onChange={onCategoryChange} checked={product.dw_jenis_kelamin === 'L'} />
                            <label htmlFor="category1">Laki-Laki</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="dw_jenis_kelamin" value="P" onChange={onCategoryChange} checked={product.dw_jenis_kelamin === 'P'} />
                            <label htmlFor="category2">Perempuan</label>
                        </div>
                    </div>
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_no_hp" className="font-bold">
                        No. HP
                    </label>
                    <InputText id="dw_no_hp" value={product.dw_no_hp} onChange={(e) => onInputChange(e, 'dw_no_hp')} required className={classNames({ 'p-invalid': submitted && !product.dw_no_hp })} />
                    {submitted && !product.dw_no_hp && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_ktp" className="font-bold">
                        Alamat KTP
                    </label>
                    <InputText id="dw_ktp" value={product.dw_ktp} onChange={(e) => onInputChange(e, 'dw_ktp')} required className={classNames({ 'p-invalid': submitted && !product.dw_ktp })} />
                    {submitted && !product.dw_ktp && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_user_submit" className="font-bold">
                        User Submit
                    </label>
                    <InputText id="dw_user_submit" value={product.dw_user_submit} onChange={(e) => onInputChange(e, 'dw_user_submit')} required className={classNames({ 'p-invalid': submitted && !product.dw_user_submit })} />
                    {submitted && !product.dw_user_submit && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field" style={{marginBottom: '15px'}}>
                    <label htmlFor="dw_alamat" className="font-bold">
                        Alamat
                    </label>
                    <InputTextarea id="dw_alamat" value={product.dw_alamat} onChange={(e) => onInputChange(e, 'dw_alamat')} required rows={3} cols={20} />
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        