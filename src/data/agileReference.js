import { teamTerms } from './teamLanguage.js'

export const agileSources = [
  {label:'Agile Manifesto · русский перевод',url:'https://agilemanifesto.org/iso/ru/manifesto.html'},
  {label:'Scrum Guide 2020',url:'https://scrumguides.org/scrum-guide.html'},
  {label:'Story points · Atlassian',url:'https://www.atlassian.com/agile/project-management/estimation/'},
]
export const festivalExamples = {
  sync:'Дизайнер и разработчик проводят разовый sync: сверяют, как в макете выглядит заполненное избранное и что показывать, если оно пустое.',
  daily:'Каждый рабочий день спринта команда коротко сверяет движение к цели. Сегодня выясняется, что для личной программы не хватает данных о времени событий; команда корректирует ближайшие действия.',
  backlog:'В Product Backlog сайта «Искра» есть избранное, фильтры событий и карта площадок. Команда пересматривает порядок: сначала нужно помочь гостю выбрать события, а карту можно улучшить позже.',
  retro:'После цикла команда замечает: ограничения данных выяснялись слишком поздно. На retro договариваются проверять доступные данные ещё до подробных макетов.',
  'story-point':'Эта команда использует points: знакомую правку подписи оценивает в 1, а работу над избранным — в 5 из-за новых состояний и неизвестных ограничений. Это их сравнительная оценка, а не часы и не обязательное правило Scrum.',
  feature:'Гость может добавить интересные события в избранное и собрать личную программу. Это feature. Макеты состояний, хранение выбора и проверка работы — отдельные задачи для её реализации.',
}
export const workCycle = [
  {id:'planning',title:'Планируем',description:'Выбираем цель и обсуждаем подходящую работу из списка. Если команда использует points, сравниваем усилия и неопределённость.',terms:['backlog','story-point'],defaultTerm:'backlog'},
  {id:'working',title:'Работаем и сверяемся',description:'Создаём и проверяем решение. Daily повторяется каждый рабочий день спринта; дополнительные sync проводим по необходимости.',terms:['daily','sync'],defaultTerm:'daily'},
  {id:'result',title:'Обсуждаем результат',description:'Вместе с заинтересованными людьми проверяем, какую возможность получил гость фестиваля и что стоит изменить дальше. Это не просто показ экранов.',terms:['feature'],defaultTerm:'feature'},
  {id:'improvement',title:'Улучшаем процесс',description:'Разбираем, как работала сама команда, и выбираем улучшение. Затем продолжаем следующий цикл с новыми знаниями.',terms:['retro'],defaultTerm:'retro'},
]
export const agileReference = teamTerms.map(term => ({...term,conceptId:`team-${term.slug}`,projectExample:festivalExamples[term.slug]}))
