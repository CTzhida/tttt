import { h } from 'snabbdom/build/package/h'
import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'

import { styleModule } from 'snabbdom/build/package/modules/style'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

var patch = init([classModule, styleModule, propsModule, eventListenersModule]);

var vnode;

var nextKey = 11 //起始id
var margin = 8
var totalHeight = 0
var sortBy = 'rank'//排序按钮 初始值
var originalData = [
    { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
    { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0 },
    { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0 },
    { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0 },
    { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0 },
    { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0 },
    { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0 },
    { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0 },
    { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0 },
    { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0 },
]
var data = [
    originalData[0],
    originalData[1],
    originalData[2],
    originalData[3],
    originalData[4],
    originalData[5],
    originalData[6],
    originalData[7],
    originalData[8],
    originalData[9],
]

//排序
function changeSort(props) { 
    sortBy = props
    data.sort((a, b) => {
        if(a[props] > b[props]) return 1
        if(a[props] < b[ props]) return -1
        return 0
    })
    render()
}

   //添加
function add(){
    var n = originalData[Math.floor(Math.random() * 10)]
    data = [{ rank: nextKey++, title: n.title, desc: n.desc, elmHeight: 0 }].concat(data)
    //添加需要调用两次render，因为他是一个异步函数，更新视图可能会快于 遍历数据
    render()
    render()
}

//移除
function remove(movie) {
    data = data.filter((m) => { return m !== movie; });
    render();
}
function movieView(movie) {
    return h('div.row',{
        key: movie.rank,
        style: {
            // background:color,
            opacity: '0',
            transform: 'translate(-200px)',
            delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
            remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` } 
        },
        hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
    },[
        h('div',  {style: {fontWeight: 'bold'}}, movie.rank),//id
        h('div', movie.title),//标题
        h('div', movie.desc),//描述
        h('div.btn.rm-btn',{on:{ click: [remove, movie] } }, 'x')//注册移除事件，传入当前节点数据
    ])
}

function view(data) {
    return h("div", [
        h("h1", "Top 10 movies"), 
        h("div", [
            h("button.btn.add", {on:{click:add}}, "Add"), 
            "Stroy by：",
            h("span.btn-group", [
                h("button.btn.rank",{
                    class:{ active: sortBy === 'rank' },
                    on: { click: [changeSort, 'rank'] }
                }, "Rank"),
                h("button.btn.title",{
                    class:{ active: sortBy === 'title' },
                    on: { click: [changeSort, 'title'] } 
                }, "Title"),
                h("button.btn.desc", {
                    class:{ active: sortBy === 'desc' },
                    on: { click: [changeSort, 'desc'] } 
                }, "Description"),
            ]),
        ]),
        h("div.list",{ style: { height: totalHeight + 'px' } }, data.map(movieView)),
    ]);
}

 //监视data
 function render() { 
   data = data.reduce((acc, m) => {
     var last = acc[acc.length - 1]
     m.offset = last ? last.offset + last.elmHeight + margin : margin
     return acc.concat(m)
   },[])
   totalHeight = data[data.length -1 ].offset + data[data.length - 1 ].elmHeight
   vnode = patch(vnode, view(data))
  }

//监听页面加载
window.addEventListener("DOMContentLoaded", () => {
  var container = document.getElementById("container")
  vnode = patch(container, view(data)) //渲染页面
  render()
});