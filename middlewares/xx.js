// // req.body
// // req.params
// // let ss = "efb0bbc914dc44ab884ee61e3774f4f5"
// // let dd = ss.split(/[a-zA-z]/).join("").slice(1,6)

// // console.log(dd)
// // function getLocalTime(nS) {
// //     return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
// // }
// //  console.log(getLocalTime("2018-11-01T00:00:00.000Z"));
// let str = "'1062944989845262336','1064099035536822276','b613d276ba2846468c283931'";
// let ans = str.match(/\w+/g)

// console.log('ans', ans[2]);
// // Array.from(res)
// // .forEach(val => {
// //     console.log(val);
// // })

// var values = [
//     ['zhao', 1],
//     ['qian', 2],
//     ['sun', 3]
// ]
// [
//     [ '1064098935443951616', '1075383135459430400' ],
//     [ '1064098829009293312', '1075383135459430400' ],
//     [ '1062944989845262336', '1075383135459430400' ],
//     [ '1064099035536822272', '1075383135459430400' ]
// ]

// var sql = 'insert into test_name(name, id) values ? on duplicate key update name = values(name)';
// connection.query(sql, [values], (err, results, fields) => {
//     if (err) { 
//         console.log('UPDATE ERROR - ', err.message);
//         throw err
//     }
//     console.log(results)
// })

// connection.end()
uuid = '8214a6a54d1c49d5ad0805af03e6bde6'
phone =1738363712
let id = uuid.substring(0, 6) + phone.toString().substring(2,10)+uuid.substring(8,12)
console.log(id);