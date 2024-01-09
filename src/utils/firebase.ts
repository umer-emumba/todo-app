import * as admin from "firebase-admin";
import * as serviceAccount from "./../../firebase-service-account.json";

//initialzie firebase using service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
