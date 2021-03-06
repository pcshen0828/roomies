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
    return Firebase.uploadBytes(storageRef, file).then((snapshot) => {
      return Firebase.getDownloadURL(snapshot.ref);
    });
  },

  addNewDoc(docRef, data) {
    this.AddDoc(this.Collection(this.DB, docRef), data);
  },

  createNewDocRef(collectionName) {
    return this.Doc(this.Collection(this.DB, collectionName));
  },

  createNewDocRefWithDocID(collectionName, docID) {
    return this.Doc(this.DB, collectionName, docID);
  },

  setNewDoc(docRef, data) {
    this.SetDoc(docRef, data);
  },

  handleError(err) {
    return err.code === "auth/invalid-email"
      ? "??????????????????"
      : err.code === "auth/wrong-password"
      ? "????????????"
      : err.code === "auth/weak-password"
      ? "???????????????????????????"
      : err.code === "auth/email-already-in-use"
      ? "?????????????????????????????????????????????"
      : err.code === "auth/user-not-found"
      ? "??????????????????????????????????????????"
      : err.code === "auth/internal-error"
      ? "????????????????????????????????????"
      : "";
  },

  async signIn(email, password) {
    return Firebase.signInWithEmailAndPassword(this.auth, email, password);
  },

  async signUp(email, password) {
    return Firebase.createUserWithEmailAndPassword(this.auth, email, password);
  },

  createNoticeByType(sender, receiver, type) {
    const newNoticeRef = api.createNewDocRef("notices");
    const time = Firebase.Timestamp.fromDate(new Date());
    api.setNewDoc(newNoticeRef, {
      id: newNoticeRef.id,
      sender,
      receiver,
      createTime: time,
      status: 0,
      type,
    });
  },
};

export default api;
