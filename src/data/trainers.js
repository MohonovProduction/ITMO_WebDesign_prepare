import { semanticsExercises, formsExercises } from './htmlExercises.js'
import { selectorExercises } from './cssLearning.js'
export const trainers = [
  { id:'selectors', label:'CSS-селекторы', description:'Выберите или напишите селектор и посмотрите, что он находит.', topics:['css.selectors'], questions:selectorExercises },
  { id:'semantics', label:'Семантика HTML', description:'Выберите тег по смыслу и контексту.', topics:['html.structure'], questions:semanticsExercises },
  { id:'forms', label:'Формы и типы input', description:'Подберите поле для задачи. Немного вопросов об отправляемых данных.', topics:['html.forms'], questions:formsExercises },
]
export function trainersForTopic(id) { return trainers.filter(t => t.topics.some(topic => topic === id || topic.startsWith(`${id}.`))) }
export const exerciseIds = trainers.flatMap(t => t.questions.flatMap(q => t.id === 'selectors' ? [`selectors-choice:${q.id}`, `selectors-input:${q.id}`] : [`${t.id}:${q.id}`]))
