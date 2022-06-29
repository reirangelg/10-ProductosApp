import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (Id: string) => Promise<void>;
    loadProductById: (Id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; //TODO: Cambiar ANY
}


export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {

        const resp = await cafeApi.get<ProductsResponse>('productos?limite=50');

        //  setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);

    }
    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId
        });
        setProducts([...products, resp.data]);
        return resp.data;
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        console.log(productId)
        const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId
        });
        setProducts(products.map(prod => {
            return (prod._id === productId)
                ? resp.data
                : prod;
        }));
    }
    const deleteProduct = async (Id: string) => {
        //const resp = await cafeApi.delete<Producto>(`/productos/${Id}`)
        const resp = await cafeApi.get<Producto>(`productos/${Id}`);
        const resp2 = await cafeApi.delete<Producto>(`/productos/${resp.data._id}`).catch((e) => { console.log(e) })


    }
    const loadProductById = async (id: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`productos/${id}`);
        return resp.data;
    }

    const uploadImage = async (data: ImagePickerResponse, id: string) => {
        const fileToUpload = {
            uri: data.assets![0].uri,
            type: data.assets![0].type,
            name: data.assets![0].fileName,
        };

        let formData = new FormData();
        formData.append('archivo', fileToUpload);
        try {
            console.log('hola')
            console.log(formData)
            const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
                method: 'put',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: () => {
                    console.log('data');

                    return formData;

                },
            });
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage
        }}>
            {children}
        </ProductsContext.Provider>
    )
}