'use strict';
const fs = require('fs');
const _ = require('underscore');

function hasDuplicate(arr){
    return (arr.length != _.uniq(arr).length);
}

function K(key, keys, cryptotableColumns) {
    var localMax = 0;
    for (var j=0;j<cryptotableColumns.length;j++) {
        if (cryptotableColumns[j].indexOf(key) > -1) {
            localMax += 1;
        }
    }
    return localMax;
}

function nod(a, b) {
    while (a != 0 && b != 0) {
        if (a > b) {
            a -= b;
        } else {
            b -= a;
        }
    }
    return a + b;
}

var cryptotableDir = 'table-input-example/cryptotable.txt';
var keysDir = 'table-input-example/keys.txt';
var plainTextDir = 'table-input-example/plaintext.txt';

var cryptotableStrings = fs.readFileSync(cryptotableDir).toString().split("\n");
var keys = fs.readFileSync(keysDir).toString().split(" ");
var plaintext = fs.readFileSync(plainTextDir).toString().split(" ");

for (var i = 0;i < cryptotableStrings.length;i++) {
    cryptotableStrings[i] = cryptotableStrings[i].split(" ");
}

var cryptotableColumns = [];
for (var i = 0;i < keys.length; i++) {
    var tmpArray = [];
    for (var j=0; j < plaintext.length; j++) {
        tmpArray.push(cryptotableStrings[j][i]);
    }
    cryptotableColumns.push(tmpArray);
}


console.log("Результаты: ");
console.log("============");
if (!hasDuplicate(cryptotableColumns)) {
    console.log(" * Данная таблица задает функцию шифрования");
} else {
    console.log(" * Данная таблица НЕ задает функцию шифрования");
}

if (!hasDuplicate(cryptotableStrings)) {
    console.log(" * Данный шифр является совершенным");
} else {
    console.log(" * Данный шифр НЕ является совершенным");
}

console.log("============");

// Считаем вероятность атаки имитации

// Считаем |K|

var countK = keys.length;
var countKMax = -1;
for (var i=0;i<keys.length;i++) {
    var Ki = K(keys[i], keys, cryptotableColumns);
    if (Ki > countKMax) {
        countKMax = Ki;
    }
}


// Считаем вероятность атаки подмены
var maxCh = -1;
var minZn = -1;
var resIt = -1;
for (var i=0; i<keys.length; i++) {
    
    var Ki = [];
    for (var j=0;j<cryptotableColumns.length;j++) {
        if (cryptotableColumns[j].indexOf(keys[i]) > -1) {
            Ki.push(j);
        }
    }
    // в Ki - K(c)
    var nonKi = [];
    for (var j=0; j< keys.length; j++) {
        nonKi = [];
        if (i != j) {
            for (var k=0;k<cryptotableColumns.length;k++) {
                if (cryptotableColumns[k].indexOf(keys[j]) > -1) {
                    nonKi.push(k);
                }
            }
            
            // посчитали здесь K(c')
            // теперь посчитаем их пересечение
            
            var set1 = new Set(Ki);
            
            var set2 = new Set(nonKi);

            var peres = new Set(
                [...set1].filter(x => set2.has(x)));

            if (Ki.length == 0) {
                Ki += 1;
            }
                
            if (peres.size / Ki.length > resIt) {
                resIt = peres.size / Ki.length;
                maxCh = peres.size;
                minZn = Ki.length;
            }
        }
    }
}

var NOD = nod(countK, countKMax);

if (countKMax / NOD == 1 && countK / NOD == 1) {
    console.log("P( атаки имитации ) = 1");
} else {
    console.log("P( атаки имитации ) = " + countKMax / NOD + " / " + countK / NOD);
}

NOD = nod(maxCh, minZn);

if (maxCh / NOD == 1 && minZn / NOD == 1) {
    console.log("P( атаки подмены ) = 1");
} else {
    console.log("P( атаки подмены ) = " + maxCh / NOD + " / " + minZn / NOD);
};
