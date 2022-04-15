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
};

export default api;
