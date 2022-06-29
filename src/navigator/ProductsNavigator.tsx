import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProductScreen } from "../screens/ProductScreen";
import { LoginScreen } from "../screens/LoginScreen";

export type ProductsStackParams = {
    ProductsScreen: undefined,
    ProductScreen: { id?: string, name?: string },
    LoginScreen: undefined
}

const Stack = createStackNavigator<ProductsStackParams>();


export const ProductsNavigator = () => {

    return (
        <Stack.Navigator
        screenOptions={{
            cardStyle:{
                backgroundColor:'#fff'
            },
            headerStyle:{
                elevation: 0,
                shadowColor: 'transparent'
            }
        }}
        >
            <Stack.Screen
                name='ProductsScreen'
                component={ProductsScreen}
                options={{ title: 'Productos' }}
            />

            <Stack.Screen
                name='ProductScreen'
                component={ProductScreen}
            />
            <Stack.Screen
                name='LoginScreen'
                component={LoginScreen}
            />
        </Stack.Navigator>
    )
}