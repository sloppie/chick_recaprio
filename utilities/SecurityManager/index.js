import React from 'react';
import { NativeModules } from 'react-native';

import Authenticator from './Query';
import { is } from '@babel/types';


export default class SecurityManager {

    constructor() {
        let secs = SecurityManager.fetchSecs();
        if (secs == "") {
            let psswd = "0000";
            let resetCode = "ledger";
            let data = SecurityManager.formatSecs(psswd, resetCode);
            SecurityManager.writeSecs(data);
        }
    }

    static get PSSWD() {
        return "PSSWD";
    }

    static get RESET_CODE() {
        return "RESET_CODE";
    }

    static getPassword() {
        let secs = SecurityManager.fetchSecs();
        let keys = secs.split("\n");
        let passKey = SecurityManager.PSSWD + "=";
        let pass = keys[0].replace(passKey, "").trim();

        return pass;
    }

    static getResetCode() {
        let secs = SecurityManager.fetchSecs();
        let keys = secs.split("\n");
        let passKey = SecurityManager.RESET_CODE + "=";
        let pass = keys[1].replace(passKey, "").trim();

        return pass;
    }

    static authenticate(psswd) {
        let expected = SecurityManager.getPassword();
        let isCorrect =  (psswd == expected);

        return isCorrect;
    }

    static authenticateResetCode(resetCode) {
        let RESET_CODE = this.getResetCode();
        let isCorrect = (resetCode === RESET_CODE);

        return isCorrect;
    }

    static changePassword(previousPassword, newPassword) {
        let authenticated = SecurityManager.authenticate(previousPassword);
        if(authenticated) {
            let RESET_CODE = SecurityManager.getResetCode();
            let newSecs = SecurityManager.formatSecs(newPassword, RESET_CODE);

            SecurityManager.writeSecs(newSecs);
        }

        return authenticated;
    }

    static resetPassword(resetCode, newPassword) {
        let RESET_CODE = this.getResetCode();
        let isCorrect = (resetCode === RESET_CODE);
        if(isCorrect) {
            let newSecs = SecurityManager.formatSecs(newPassword, RESET_CODE);
            SecurityManager.writeSecs(newSecs);            
        }

        return isCorrect;
    }

    static fetchSecs() {
        let secs = NativeModules.Security.fetchSecs();

        return secs;
    }

    static formatSecs(psswd, resetCode) {
        let data = `${SecurityManager.PSSWD}=${psswd}\n${SecurityManager.RESET_CODE}=${resetCode}`;
        return data;
    }

    static writeSecs(data) {
        NativeModules.Security.writeSecs(data);
    }

    static runAuthenticationQuery(ref, action) {
        return <Authenticator ref={ref} action={action}/>
    }

}
