import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, TextInput, View, Button, Image } from "react-native";

import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { StackScreenProps } from "@react-navigation/stack";
import { ProductsStackParams } from "../navigator/ProductsNavigator";
import { useCategories } from "../hooks/useCategories";
import { useForm } from "../hooks/useForm";
import { ProductsContext } from "../context/ProductsContext";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };
let myPhoto: any = null;

export const ProductScreen = ({ navigation, route }: Props) => {

    const { id = '', name = '' } = route.params;

    const [tempUri, setTempUri] = useState<string>()

    const { categories } = useCategories()

    const { loadProductById, addProduct, updateProduct, uploadImage, deleteProduct, loadProducts } = useContext(ProductsContext)

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''

    });

    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Sin nombre de producto'
        })
    }, [nombre])

    useEffect(() => {
        loadProduct();
    }, [])

    const loadProduct = async () => {
        if (id.length === 0) return;
        const product = await loadProductById(id);
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre
        })
    }

    const saveOrUpdate = async () => {

        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id);
            if (myPhoto !== null) {
                uploadImage(myPhoto, form._id)
                myPhoto = null;
                navigation.navigate('ProductsScreen')
            }

        } else {

            const tempCategoriaId = categoriaId || categories[0]._id;
            const newProduct = await addProduct(tempCategoriaId, nombre);
            onChange(newProduct._id, '_id');
        }
    }

    const deleteProd = async () => {
        await deleteProduct(_id)
        await loadProducts()

        navigation.navigate('ProductsScreen')
    }
    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        },
            (resp) => {
                if (resp.didCancel) return;

                if (!resp.assets?.[0].uri) return

                console.log(resp.assets?.[0].uri)
                setTempUri(resp.assets?.[0].uri);
                myPhoto = resp;
                //uploadImage(resp, form._id);
            });
    }

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        },
            (resp) => {
                if (resp.didCancel) return;

                if (!resp.assets?.[0].uri) return;

                console.log(resp.assets?.[0].uri)
                setTempUri(resp.assets?.[0].uri);
                myPhoto = resp;
                //  uploadImage(resp, _id)
            });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto:</Text>
                <TextInput
                    placeholder="Producto"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                {/* Picker o un Selector*/}
                <Text style={styles.label}>Categoría:</Text>

                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}
                >
                    {
                        categories.map(c => (
                            <Picker.Item
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={saveOrUpdate}
                        style={{ flex: 1, backgroundColor: '#5856d6', borderRadius: 10, width: 83, height: 40, marginHorizontal: 20 }}
                    >
                        <Text style={{ color: 'white', fontSize: 16, paddingVertical: 8, paddingHorizontal: 12 }}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={deleteProd}
                        style={{ flex: 1, backgroundColor: '#800080', borderRadius: 10, width: 83, height: 40 }}
                    >
                        <Text style={{ color: 'white', fontSize: 16, paddingVertical: 9, paddingHorizontal: 19 }}>Borrar</Text>
                    </TouchableOpacity>

                </View>


                {
                    (img.length > 0 && !tempUri) && (

                        <Image
                            source={{ uri: img }}
                            style={{
                                marginTop: 15,
                                width: '100%',
                                height: 220
                            }}
                        />
                    )
                }

                {/* TODO: Mostrar imagen temporal */}

                {
                    (tempUri) && (

                        <Image
                            source={{ uri: tempUri }}
                            style={{
                                marginTop: 15,
                                width: '100%',
                                height: 220
                            }}
                        />
                    )
                }

                {
                    (_id.length > 0) && (
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={takePhoto}
                                style={{ flex: 1, backgroundColor: 'pink', borderRadius: 10, width: 83, height: 40, marginHorizontal: 20 }}
                            >
                                <Text style={{ color: 'white', fontSize: 16, paddingVertical: 8, paddingHorizontal: 12 }}>Cámara</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={takePhotoFromGallery}
                                style={{ flex: 1, backgroundColor: 'orange', borderRadius: 10, width: 83, height: 40 }}
                            >
                                <Text style={{ color: 'white', fontSize: 16, paddingVertical: 8, paddingHorizontal: 16 }}>Galeria</Text>
                            </TouchableOpacity>

                        </View>
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 15

    }

});


