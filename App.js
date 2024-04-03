
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import AboutScreen from './components/AboutScreen';
import Register from './components/Register';
import Login from './components/Login';
import Profiles from './components/Profiles';
import { registerRootComponent } from 'expo';
import useAuth from './hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function App() {
    const {user} = useAuth();
    if (user) {
        return (
            <NavigationContainer> 
                <Stack.Navigator initialRouteName='Home'> 
                    <Stack.Screen
                        name="Home"
                        options={{headerShown: false}}
                        component={HomeScreen}
                    />             
                    <Stack.Screen
                        name="About"
                        options={{headerShown: false}}
                        component={AboutScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );        
    }
    else {
        return (
            <NavigationContainer> 
                <Stack.Navigator initialRouteName='Login'> 
                    <Stack.Screen
                        name="Login"        //initialRouteName is default screen of stack. Login is default 
                        options={{headerShown: false}}
                        component={Login}
                    /> 
                    <Stack.Screen
                        name="Home"
                        options={{headerShown: false}}
                        component={HomeScreen}
                    />
                    <Stack.Screen
                        name="Register"
                        options={{headerShown: false}}
                        component={Register}
                    />                
                    <Stack.Screen
                        name="About"
                        options={{headerShown: false}}
                        component={AboutScreen}
                    />
                    <Stack.Screen
                        name="Profiles"
                        options={{headerShown: false}}
                        component={Profiles}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
