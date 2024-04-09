
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
//import HomeScreen from './components/HomeScreen';
import Register from './components/Register';
import Login from './components/Login';
import AddProfile from './components/AddProfile';
import Profiles from './components/Profiles';
//import EditBaby from './components/EditBaby';
=======
import HomeScreen from './components/HomeScreen';
//import AboutScreen from './components/AboutScreen';
import Register from './components/Register';
import Login from './components/Login';
import Profiles from './components/Profiles';
>>>>>>> main
import { registerRootComponent } from 'expo';
import useAuth from './hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function App() {
    const {user} = useAuth();
    if (user) { //these should be screens viewable by only an authorized user
        return (
            <NavigationContainer> 
                <Stack.Navigator initialRouteName='Profiles'> 
<<<<<<< HEAD

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
=======
                    <Stack.Screen           // 'Profiles' is the home screen when a user logs in and is the first screen they see
                        name="Profiles"
                        options={{headerShown: false}}
                        component={Profiles}
                    />
                    <Stack.Screen //this screen is currently not in use
                        name="Home"
                        options={{headerShown: false}}
                        component={HomeScreen}
                    />
>>>>>>> main
                </Stack.Navigator>
            </NavigationContainer>
        );        
    }
    else {
        return ( //if user is not loggged in, they can only view a login or register screen
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
<<<<<<< HEAD
        
=======

>>>>>>> main
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
