const csvFilePath='Test.csv'
const csv=require('csvtojson')

var arr;
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    var keys = [];
    var table = jsonObj.slice(1,jsonObj.length)
    var testObj = jsonObj[0]
    
    values = []
    


    var x
    for (x in testObj){
        
        keys.push(testObj[x])
    }
    keys = keys.slice(0,keys.length-1)
    

    for (x in testObj){
        values.push(x)
    }
    values = values.slice(0,values.length-1)
    console.log(table)
    var y
    var qnum = 0
    

    dataset = [0,0,0,0,0,0,0,0]

    for (x in table){
        qnum = 0
        console.log(table[x])
        
        for (y in table[x]){
            delete table[x].Names
            console.log(table[x][qnum+1])

            if (table[x][qnum+1] == keys[qnum]){
                dataset[qnum] += 1
            }

            qnum +=1


        }

    }
    console.log(dataset)
    


    


    

















})
 
// Async / await usage
const jsonArray=csv().fromFile(csvFilePath);



