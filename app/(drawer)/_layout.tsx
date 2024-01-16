import { Ionicons } from '@expo/vector-icons'
import {  colorTokens, size } from '@tamagui/themes'
import Drawer from 'expo-router/drawer';
const Layout = () => {
    return(
        <Drawer
        screenOptions={{
            headerShown: true,
            drawerHideStatusBarOnOpen: false,
            drawerActiveBackgroundColor: colorTokens.dark.blue.blue6,
            drawerActiveTintColor: '#fff',
            drawerLabelStyle:{marginLeft:20},
        }}>
            <Drawer.Screen name="home" options={{
                title: 'Moviestar',
                headerShown: false,
                drawerIcon: ({color,size}) => <Ionicons name="ios-home" size={size} color={color} />,
            }}/>
            <Drawer.Screen name="favorites" options={{
                title:'My Favorites',
                headerShown: false,
                drawerIcon: ({color, size}) => <Ionicons name="star-outline" size={size} color={color} />
            }}/>
            
            
        </Drawer>
    )

}

export default Layout