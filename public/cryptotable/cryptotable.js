$(document).ready(function () {
    
    var countRows = 4;
    var countCols = 5;

    printCryptotable(countRows, countCols);
    
    $('#countRows').change(function () {
        countRows = +$('#countRows').val();
        printCryptotable(countRows, countCols);
    });

    $('#countCols').change(function () {
        countCols = +$('#countCols').val();
        printCryptotable(countRows, countCols);
    });
    
    $('#calculate').click(function () {
        // надо отправить на сервер данные из таблицы
        var keys = [];
        var plaintext = [];
        for (var i=1;i<=countCols;i++) {
            keys.push(i);
        };
        for (var i=1;i<=countRows;i++) {
            plaintext.push(i);
        };
        var cryptotableStrings = [];
        var correctTable = true;
        for (var i=1;i<=countRows;i++) {
            var tempM = [];
            for (j=1;j<=countCols;j++) {
                var now = $('#' + i + '-' + j).text();
                if (now == '') {
                    correctTable = false;
                }
                tempM.push(now);
            }
            cryptotableStrings.push(tempM);
        }
        if (correctTable) {
            $.get(
                "/calc",
                {
                    keys: keys,
                    cryptotableStrings: cryptotableStrings,
                    plaintext: plaintext
                },
                onAjaxSuccess
            );
        }

        function onAjaxSuccess(data)
        {
            var resultString = "Результат:</br>";
            resultString += data.resIm;
            resultString += '</br>';
            resultString += data.resPm;
            resultString += '</br>';
            $('#result').html(resultString);
        }
    });

    function printCryptotable(rows, cols) {
        // почистим все, что было в <tbody id="mainTBody">
        $('#mainTBody').empty();

        // сгенерируем сначала заголовка
        var firstRow = '<tr><th></th>';
        for (var i = 1;i <= cols;i++) {
            firstRow += "<th>" + i +"</th>";
        }
        firstRow += "</tr>";
        
        $('#mainTBody').append(firstRow);
        var nowRow;
        for (var i = 1;i <= rows;i++) {
            nowRow = "<tr>";
            nowRow += "<th>" + i + "</th>";
            for (var j = 1;j <= cols;j++) {
                nowRow += "<td><span id='" + i + "-" + j + "' contenteditable></span></td>";
            }
            nowRow += "</tr>";
            $('#mainTBody').append(nowRow);
        }
    }
});