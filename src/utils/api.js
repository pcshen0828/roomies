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

  createQuery(collectionName, columnName, compare, value) {
    return this.Query(
      this.Collection(this.DB, collectionName),
      this.Where(columnName, compare, value)
    );
  },
  async getCollectionGroup(subCollectionName, columnName, compare, value) {
    const query = this.Query(
      Firebase.collectionGroup(this.DB, subCollectionName),
      this.Where(columnName, compare, value)
    );
    const querySnapshot = await this.GetDocs(query);
    return querySnapshot.docs.map((doc) => doc.data());
  },
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
  async updateDocData(collectionName, docID, data) {
    this.UpdateDoc(this.Doc(this.DB, collectionName, docID), data);
  },
  updateSubCollectionDocData(
    collectionName,
    docID,
    subCollectionName,
    subDocID,
    data
  ) {
    this.UpdateDoc(
      this.Doc(this.DB, collectionName, docID, subCollectionName, subDocID),
      data
    );
  },
  async uploadFileAndGetDownloadUrl(storagePath, file) {
    const storageRef = Firebase.ref(Firebase.storage, storagePath);
    return Firebase.uploadBytes(storageRef, file);
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
  handleError(err) {
    console.log(err);
    return err.code === "auth/invalid-email"
      ? "信箱格式錯誤"
      : err.code === "auth/wrong-password"
      ? "密碼錯誤"
      : err.code === "auth/weak-password"
      ? "密碼至少要有六位元"
      : err.code === "auth/email-already-in-use"
      ? "此信箱已註冊過，請使用另一信箱"
      : err.code === "auth/user-not-found"
      ? "查無用戶，請確認資料輸入正確"
      : err.code === "auth/internal-error"
      ? "系統錯誤，請重新再試一次"
      : "";
  },
  async signIn(email, password, setError) {
    Firebase.signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        setError(this.handleError(error));
      });
  },
  async signUp(email, password) {
    return Firebase.createUserWithEmailAndPassword(this.auth, email, password);
  },
};

export default api;
