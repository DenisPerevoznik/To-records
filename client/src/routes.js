import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {Auth} from './views/Auth';
import {Register} from "./views/Register";
import {Home} from './views/Home';
import { NotepadViewing } from "./views/NotepadViewing";
import { Available } from "./views/Available";
import { Profile } from "./views/Profile";

export const useRoutes = isAuthenticated => {

    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/notepads" exact>
                    <Home/>
                </Route>

                <Route path="/available">
                    <Available/>
                </Route>

                <Route path="/profile">
                    <Profile/>
                </Route>

                <Route path="/notepads/notepad/:notepadId" component={NotepadViewing}/>

                <Redirect to="/notepads"/>
            </Switch>
        );
    }
    else{
        return(
            <Switch>
                <Route path="/" exact>
                    <Auth/>
                </Route>

                <Route path="/register" exact>
                    <Register/>
                </Route>

                <Redirect to="/"/>
            </Switch>
        );
    }
}