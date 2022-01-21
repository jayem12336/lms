import { 
  db, 
  // bucketRef, 
  auth 
} from './firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs,getDoc, updateDoc, doc, arrayUnion,arrayRemove, setDoc, orderBy, query, where, deleteDoc} from "firebase/firestore"; 



/**
 * 
 * @param {string} email 
 * @param {string} password
 * @param {object} data
 */
export const createUser = async (email, password, data) => {
  const isUserCreated = await createUserWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setDoc(doc(db, 'users', user.uid), 
      {
        displayName: data.displayName, 
        email: data.email, 
        isTeacher: data.isTeacher,
        phone: data.phone,
        ownerId: user.uid
      }
    );
    return user
    // ...
  })
  .catch((err) => {
    return err
  });
  return isUserCreated
}

export const createUserGoogle = async (userId, data) => {
    // Signed in 
  //   const user = setDoc(doc(db, 'users', user.uid), 
  //   {
  //     displayName: data.displayName, 
  //     email: data.email, 
  //     isTeacher: data.isTeacher,
  //     phone: data.phone,
  //     ownerId: user.uid
  //   }
  // );
  const user = await setDoc(doc(db, 'users', userId), data);
   
  return user
}

/**
 * 
 * @param {string} collectionName 
 * @param {object} data
 */
// Create a document
export const createDoc = async (collectionName, data) => {

  const docInstance = await addDoc(collection(db,collectionName),data)
  return docInstance
}

/**
 * 
 * @param {string} collectionName
 * @param {string} id 
 * @param {object} data
 */
// Create a document
export const createClassDoc = async (collectionName, id, data) => {

  // const docInstance =  doc(collection(db,collectionName, id),data)
  const docInstance = await setDoc(doc(db, collectionName, id), data);

  return docInstance
}

/**
 * 
 * @param {string} classCode
 * @param {string} studentId
 * @param {string} labId
 */
// save laboratory
export const getLabStudent = async (classCode, studentId, labId) => {
  const docRef = doc(db, "createclass", classCode, "students", studentId, "laboratory", labId);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}

/**
 * 
 * @param {object} data
 */
// save laboratory
export const saveLabStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'laboratory', data.labId)
  setDoc(colRef,data);

  return colRef
}

/**
 * 
 * @param {object} data
 */
// save quiz
export const saveQuizStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'quiz', data.quizId)
  setDoc(colRef,data);

  return colRef
}


/**
 * create doc
 * @param {string} collectionName 
 * @param {string} classCode
 * @param {object} studentData
 */
export const joinClass = async (collectionName, classCode, studentData) => {
  // const addData = doc(db, collectionName, id);

// Update field
  // await updateDoc(addData,data);
  // const studentObj = {...studentData, isJoin: false}
  let studentObj = {}
  studentData.map(student => {
    studentObj = {...student , isJoin:false}
  })
  // await updateDoc(addData, {
  //   students: arrayUnion(studentObj)
  // });

  // const docInstance = await setDoc(doc(db, collectionName, id), studentObj);
  const docInstance = await updateDoc(doc(db, collectionName, classCode), {
    students: arrayUnion(studentObj)
  });

  return docInstance
}

/**
 * create doc
 * @param {string} collectionName 
 * @param {string} classCode
 * @param {object} classData
 * @param {object} studentData
 */
export const acceptStudent = async (collectionName, classCode, classData, studentData) => {
  const addData = doc(db, collectionName, classCode);

// Update field
  // await updateDoc(addData,data);
  const studentObj = {...studentData, isJoin: true}

  await updateDoc(addData, {
    students: arrayRemove(studentData)
  });
  await updateDoc(addData, {
    students: arrayUnion(studentObj)
  });
  const studentRecord = doc(db, 'studentRecord', studentData.ownerId)
  const classroomRecord = collection(studentRecord, 'classroom')
  // await addDoc(collection(db,'studentRecord', studentData.ownerId),collection(db, 'classroom', classCode),classData)
  // await setDoc(classroomRecord,classData)
  const docRef = doc(db, "studentRecord", studentData.ownerId);
  // const colRef = collection(docRef, "classroom", classCode)
  const colRef = doc(db, "studentRecord", studentData.ownerId, "classroom", classCode)
  setDoc(colRef, classData);
  return addData
}

/**
 * create doc
 * @param {string} collectionName 
 * @param {string} id
 * @param {object} data
 * @param {object} studentData
 */
export const removeStudent = async (collectionName, id, data, studentData) => {
  const removeData = doc(db, collectionName, id);
// Update field
  // await updateDoc(addData,data);
  const studentObj = {...studentData, isJoin: false}

  await updateDoc(removeData, {
    students: arrayRemove(studentData)
  });
  await updateDoc(removeData, {
    students: arrayUnion(studentObj)
  });

  await deleteDoc(doc(db, "studentRecord", studentData.ownerId, 'classroom', id));

  return removeData
}

/**
 * 
 * @param {string} collectionName 
 */
export const getDocsByCollection = async (collectionName) => {
  const data = collection(db, collectionName)
  const querySnapshot = await getDocs(data);
    return querySnapshot.docs.map((doc) => doc.data())

}

/**
 * 
 * @param {string} collectionName 
 * @param {string} classCode
 */
export const getStudentByAssigned = async (classCode) => {
  const docRef = doc(db, "createclass", classCode);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}

/**
 * 
 * @param {string} collectionName 
 * @param {object} data
 */
export const updateDocsByCollection = async (collectionName, data) => {
  const getData = collection(db, collectionName)
  const querySnapshot = await getDocs(getData);
  let docId = ''
  // console.log(data.labId)
  // console.log(collectionName)
  // querySnapshot.docs.filter(item => item.ownerId === data.ownerId).map((doc) => docId = doc.id)
  docId = querySnapshot.docs.filter(item => item.data().ownerId === data.ownerId).map((doc) => {
    // console.log(doc.id)
    // let docId = ''
    return doc.id
  })
  // console.log(docId)
  const docInstance = doc(db, collectionName, data.labId)
  await updateDoc(docInstance, data);
  return docInstance

}

/**
 * 
 * @param {string} collectionName 
 * @param {string} sort
 */
export const getAnnouncement = async (collectionName, sort) => {
  const data = collection(db, collectionName)
  const q = query(data,orderBy(sort, 'desc'))
  const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data())

}

/**
 * @param {*} folderName 
 * @param {*} fileName 
 * @param {*} file 
 */
// export const createFile = async (folderName, fileName, file) => {
//   const isCreated = bucketRef.child(`${folderName}/${fileName}`).putString(file, 'data_url').then((snapshot) => {
//     return bucketRef.child(snapshot.ref.location.path_).getDownloadURL()
//   }).catch(err => {
//     return err
//   });

//   return isCreated
// }

/**
 * 
 */
export const getUser = async () => {
const user = await auth.currentUser;

if (user) {
  console.log(user)
  const data = collection(db, 'users')
  const q = query(data,where("ownerId", "==", user.uid))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data())
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // ...
} else {
  // No user is signed in.
}
  // const userDetails = await onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     console.log(user)
  //     return user.uid;
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });
  return user
       
}

export const getUserLogin = async (email) => {
    const data = collection(db, 'users')
    const q = query(data,where("email", "==", email))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data())
   
         
  }