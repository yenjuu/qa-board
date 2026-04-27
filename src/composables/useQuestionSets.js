import { ref, onMounted } from 'vue'
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc, arrayUnion, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

export function useQuestionSets() {
  const questionSets = ref([])
  const loading = ref(true)

  const setsRef = collection(db, 'questionSets')
  const q = query(setsRef, orderBy('createdAt', 'desc'))

  onMounted(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      questionSets.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    })
    return unsub
  })

  const createSet = async (name) => {
    if (!name.trim()) return
    return await addDoc(setsRef, {
      name: name.trim(),
      questions: [],
      createdAt: serverTimestamp()
    })
  }

  const deleteSet = async (id) => {
    await deleteDoc(doc(db, 'questionSets', id))
  }

  const addQuestion = async (setId, textOrArray) => {
    const texts = Array.isArray(textOrArray) ? textOrArray : [textOrArray]
    const filtered = texts.map(t => t.trim()).filter(t => t !== '')
    if (filtered.length === 0) return
    
    const setRef = doc(db, 'questionSets', setId)
    await updateDoc(setRef, {
      questions: arrayUnion(...filtered)
    })
  }

  const removeQuestion = async (setId, questions, index) => {
    const setRef = doc(db, 'questionSets', setId)
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    await updateDoc(setRef, {
      questions: updatedQuestions
    })
  }

  return {
    questionSets,
    loading,
    createSet,
    deleteSet,
    addQuestion,
    removeQuestion
  }
}
