import { StackScreenProps } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ProductsContext } from "../context/ProductsContext";
import { ProductsStackParams } from "../navigator/ProductsNavigator";
import { LoginScreen } from "./LoginScreen";


interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { };

export const ProductsScreen = ({ navigation }: Props) => {


    const [isRefreshing, setIsRefreshing] = useState(false)
    const { logOut } = useContext(AuthContext);
    const { products, loadProducts } = useContext(ProductsContext)

    const exit = () => {
        logOut()
        // navigation.navigate('LoginScreen')
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate('ProductScreen', {})}
                >
                    <Text>Agregar </Text>
                </TouchableOpacity>

            )
        })
    }, [])

    const loadProductsFromBackend = async () => {
        console.log(products.length)
        setIsRefreshing(true);
        await loadProducts();
        setIsRefreshing(false);
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(p) => p._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            () => navigation.navigate('ProductScreen', {
                                id: item._id,
                                name: item.nombre
                            })
                        }
                    >
                        <Text style={styles.productsName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadProductsFromBackend}
                    />
                }
            />
            <View style={styles.viewExit}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={exit}
                    style={styles.buttonExit}
                >
                    <Text style={styles.textExit}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginHorizontal: 10
    },
    productsName: {
        fontSize: 20
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    viewExit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonExit: {
        backgroundColor: 'orange',
        borderRadius: 10,
        width: 135,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textExit: {
        color: 'black',
        fontSize: 16
    }
});