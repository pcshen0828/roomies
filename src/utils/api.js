import { Firebase } from "./firebase";

const api = {
  Query: Firebase.query,
  Collection: Firebase.collection,
  DB: Firebase.db,
  Where: Firebase.where,
  GetDocs: Firebase.getDocs,
  UpdateDoc: Firebase.updateDoc,
  Doc: Firebase.doc,
  AddDoc: Firebase.addDoc,
  SetDoc: Firebase.setDoc,
  auth: Firebase.getAuth(),

  async getDataWithSingleQuery(collectionName, columnName, compare, value) {
    const query = this.Query(
      this.Collection(this.DB, collectionName),
      this.Where(columnName, compare, value)
    );
    const querySnapShot = await this.GetDocs(query);
    return querySnapShot.docs.map((doc) => doc.data());
  },
  async getAllDocsFromCollection(collectionName) {
    const query = this.Query(this.Collection(this.DB, collectionName));
    const querySnapShot = await this.GetDocs(query);
    return querySnapShot.docs.map((doc) => doc.data());
  },
  updateDocData(collectionName, docID, data) {
    this.UpdateDoc(this.Doc(this.DB, collectionName, docID), data);
  },
  addNewDoc(docRef, data) {
    this.AddDoc(this.Collection(this.DB, docRef), data);
  },
  createNewDocRef(collectionName) {
    return this.Doc(this.Collection(this.DB, collectionName));
  },
  setNewDoc(docRef, data) {
    this.SetDoc(docRef, data);
  },
  signIn(email, password) {
    Firebase.signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        return error;
      });
  },
  signUp(email, password, role) {
    Firebase.createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        const userId = userCredential.user.uid;
        this.SetDoc(this.Doc(this.DB, "users", userId), {
          uid: userId,
          role,
          email,
          password,
          profileImage:
            "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/users%2Fdefault%2Fdefault?alt=media&token=381e1e3a-523e-4b92-b09e-871f4e0ca48e",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export default api;
