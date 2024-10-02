
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import Register from './components/Register';
import Login from './components/Login';
import AddProfile from './components/AddProfile';
import Profiles from './components/Profiles';
import ShareBaby from './components/ShareBaby';
import { registerRootComponent } from 'expo';
import useAuth from './hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function App() {
    const {user} = useAuth();
    if (user) {
        return (
            <NavigationContainer> 
                <Stack.Navigator initialRouteName='Profiles'> 

                    <Stack.Screen
                        name="Profiles"
                        options={{headerShown: false}}
                        component={Profiles}
                    />             
                    <Stack.Screen
                        name="AddProfile"
                        options={{headerShown: false}}
                        component={AddProfile}
                    />             
                    <Stack.Screen
                        name="HomeScreen"
                        options={{headerShown: false}}
                        component={HomeScreen}
                    />    
                    <Stack.Screen
                        name="ShareBaby"
                        options={{headerShown: false}}
                        component={ShareBaby}
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
                        name="Register"
                        options={{headerShown: false}}
                        component={Register}
                    />                
        
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}