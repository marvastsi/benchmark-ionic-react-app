import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonNavLink, IonProgressBar, IonRow, IonSpinner } from '@ionic/react';
import { Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { LENGTH_LONG, sleep } from '../../commons/Constants';
import validateField from '../../commons/validator/Validator';
import AppBar from '../../components/AppBar';
import { HttpException } from '../../http/errors/HttpException';
import HttpClient from '../../http/services/HttpClient';
import Execution from '../Execution/Execution';
import './LoginPage.css';
import FormButton from '../../components/FormButton';
import { useHistory } from 'react-router';
import { saveToken } from '../../commons/CredentialStorage';

const LoginPage = () => {
  const history = useHistory();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [baseUrl, setBaseUrl] = useState("http://192.168.100.129:3000/api");
  const [loaded, setLoaded] = useState(false);
  const [valuesFilled, setValuesFilled] = useState(false);

  ///Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /////// validations START
  const [usernameError, setUsernameError] = useState();
  const [passwordError, setPasswordError] = useState();

  const [isTouchedPass, setIsTouchedPass] = useState(false);
  const [isTouchedUsername, setIsTouchedUsername] = useState(false);
  const [formValid, setFormValid] = useState<Boolean>();

  useEffect(() => {
    if (usernameError || passwordError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [usernameError, passwordError]);
  /////// END validations

  const handleLogin = async () => {
    setSnackMessage(`User: ${username}, Pass: ${password}`);
    setShowSnack(true);
    console.log(`User: ${username}, Pass: ${password}`);

    try {
      const client = new HttpClient(baseUrl);
      const token = await client.login({ username, password });

      if (token) {
        saveToken(token);

        setSnackMessage(`${token.value}`);
        setShowSnack(true);
      }
    } catch (error) {
      let err = error as HttpException;
      setSnackMessage(`${err.status}: Login failed`);
      setShowSnack(true);
    }

    await sleep(3000);
    history.goBack();
  };

  return (
    <>
      <AppBar title='Login' />
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">

              <IonInput
                className={`${formValid && 'ion-valid'} ${formValid === false && 'ion-invalid'} ${isTouchedUsername && 'ion-touched'}`}
                autoCorrect="off"
                placeholder="Username"
                type="text"
                value={username}
                errorText={usernameError}
                onIonChange={(e) => setUsername(e.detail.value!.trim())}
                onIonInput={(e) => setUsername(e.detail.value!.trim())}
                onIonBlur={(event) => {
                  setIsTouchedUsername(true);
                  setUsernameError(validateField("loginUsername", username))
                }}
              ></IonInput>

              <IonInput
                className={`${formValid && 'ion-valid'} ${formValid === false && 'ion-invalid'} ${isTouchedPass && 'ion-touched'}`}
                autoCorrect="off"
                placeholder="Password"
                type="password"
                value={password}
                errorText={passwordError}
                onIonChange={(e) => setPassword(e.detail.value!.trim())}
                onIonInput={(e) => setPassword(e.detail.value!.trim())}
                onIonBlur={(event) => {
                  setIsTouchedPass(true);
                  setPasswordError(validateField("loginPassword", password))
                }}
              ></IonInput>

              {/* <IonNavLink routerDirection="back" component={() => <Execution />}> */}
              <FormButton
                title="Login"
                onPress={handleLogin}
                disabled={!formValid}
              />
              {/* </IonNavLink> */}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <Snackbar
        open={showSnack}
        autoHideDuration={LENGTH_LONG}
        message={snackMessage}
      />
    </>
  );
};


export default LoginPage;