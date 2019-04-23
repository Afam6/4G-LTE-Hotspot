//*********************************************************/
//*         Class JSTableGrid
//*    
//*********************************************************/

function JSTableGrid()
{
    return this;
}

JSTableGrid.prototype = {
    init: function(tableID, options, maxNum, cellUIFields, removeButton) {
        this.initParams();
        this.tableElem = doc.E(tableID);
        this.tableElem.gridObj = this;
        this.doSort = options.indexOf('sort') != -1;
        if (maxNum)
            this.maxNum = maxNum;
        if (cellUIFields != null)
            this.doEdit = true;
        
        this.doEdit = options.indexOf('disEdit') == -1;
        this.delHeader = options.indexOf('delHeader') != -1;
        this.numHeader = options.indexOf('numHeader') != -1;
        this.doHeaderInfo = options.indexOf('disHeaderInfo') == -1;    
        this.isFixedTable = options.indexOf('fixedTable') != -1;
        if (this.isFixedTable)
            this.delHeader = false;    
        
        this.cellUIFields = cellUIFields;
        this.removeButton = removeButton;
    },
    
    //init related parameters
    initParams: function(){
        this.tableElem = null;            // <DIV > element id
        this.header = null;                // Table Header Title
        this.header2 = null;            // Table Header Title (2 Rows)
        this.footer = null;                // Table Footer (function)
        this.maxNum = 1000;                // Maxmumin Row Size
        this.doEdit = true;                // Do edit table?
        this.doDelete = false;            // Do delete row?
        this.doSort = false;                // Do sort data?
        this.doMove = false;                // Do Move row?
        this.sortColumn = -1;            // Sort Column Index
        this.sortAscending = true;        // Sort Ascending or Descending 
        this.cellUIFields = null;        // Cell UI Field Type
        this.editor = null;                // Record current edit row
        this.delHeader = false;
        this.numHeader = false;
        this.btnAddURL = false;            // 'add' button' URL
        this.rowClickURL = null;        // 'row click' URL
        this.headerInfo = null;            // Table Header Info
        this.doHeaderInfo = true;
        this.isFixedTable = false;
        this.extraCols = 0;
        this.numPage = [10,20,30,50,80,100];
        this.addButtonName = null;
        this.okButtonName = null;
        this.btnOKURL = false;
        this.instanceID = 0;
        this.hiddenID = null;
    },
    setInstanceID: function(instanceID){
        this.instanceID = instanceID;    
    },
    getInstanceID: function(){
        return this.instanceID;    
    },    
    setNumPage: function(numPage){
        this.numPage = numPage;
    },
    setAddURL: function(addURL){
        this.btnAddURL = addURL;
    },
    setOKURL: function(OKURL){
        this.btnOKURL = OKURL;
    },    
    setAddButtonName: function(addButtonName){
        this.addButtonName = addButtonName;
    },
    setOKButtonName: function(okButtonName){        
        this.okButtonName = okButtonName;
    },    
    setRowClickURL: function(rowClickURL){
        this.rowClickURL = rowClickURL;
    },
    // insert one row in this table
    insertRow: function(rowIndex, cells,headerFlag) {
        var field;
        var tr, td;
        var type;
        var h_list ='';
        tr = this.tableElem.insertRow(rowIndex);
                    
        for (var i = 0; i < cells.length; ++i) {
            field = cells[i];
            
            td = tr.insertCell(i);
            td.align = "center";
                        
            if (headerFlag) {         
                if (field[2] == 'hidden'){
                    h_list = i + ",";                          
                }
                           
                td.innerHTML = field[0];
                td.width = field[1];
                td.className = "header";
                type = 0;
            } else {
                td.innerHTML = this.getOptionsName(i,field);
                type = 1;                            
            }
            td = null;
            field = null;
        }
        
        var pos = 0;

        if (this.numHeader)
        {
            if (type == 0)
            {
                td = tr.insertCell(0);
                td.align = "center";
                td.width = 10;
                td.className = "header";
                td.innerHTML = "#";
                td = null;
            }else{
                td = tr.insertCell(0);                
                if (this.doHeaderInfo)
                    td.innerHTML = this.tableElem.rows.length-3;
                else
                    td.innerHTML = this.tableElem.rows.length-2;
                td = null;
            }
            pos++;
        }
        
        if (this.delHeader) {
            if (type == 0) {
                td = tr.insertCell(i+pos);    
                td.align = "center";
                td.width = 40;
                td.className = "header";
                td = null;
            } else {
                td = tr.insertCell(i+pos);    
                td.innerHTML ='<img src="img/trashcan.gif">';    
                td = null;
            }    
        }
        
        if (this.hiddenID)        
            h_list = this.hiddenID; 
         
        h_list = h_list.split(",");              
        for (var i =0; i <h_list.length; i++) {
            if (h_list[i] !='') {
                var j = h_list[i] * 1; 
                if (headerFlag) {
                    j = j + pos;                      
                    this.hiddenID = this.hiddenID + j +",";        
                }
                tr.cells[j].style.display="none";  
            }
        } 
        
        field = null;
        td = null;
        return tr;
    },
    // insert two row header
    insertTwoRow: function(rowIndex, cells) {
        var field;
        var tr, td;
        var type;
        var h_list ='';
        tr = this.tableElem.insertRow(rowIndex);
        
        for (var i = 0; i < cells.length; ++i) {
            field = cells[i];
            td = tr.insertCell(i);
            td.align = "center";
            td.innerHTML = field[0];
            td.width = field[1];
            td.className = "header";
                                        
            if (!field[2]){
                td.rowSpan = 2;            
            } else {
                if (field[2] == "hidden"){
                    var _i = i + this.extraCols;
                    h_list = i + '-' + _i + ",";
                    td.rowSpan = 2;
                }else{            
                    td.colSpan = field[2].length; 
                    this.extraCols += (field[2].length - 1);                                        
                }
            }
            td = null;
            field = null;
        }                    
          
        var pos = 0;

        if (this.numHeader)
        {
            td = tr.insertCell(0);
            td.align = "center";
            td.width = 10;
            td.className = "header";
            td.innerHTML = "#";
            td.rowSpan = 2;
            pos++;
            td = null;
        }
        
        if (this.delHeader)
        {
            td = tr.insertCell(i+pos);    
            td.align = "center";
            td.width = 40;
            td.className = "header";
            td.rowSpan = 2; 
            td = null;
        }
                 
        h_list = h_list.split(",");                

        for (var i =0; i <h_list.length; i++)
        {           
            if (h_list[i] !='')
            {
                var _h_list = h_list[i].split("-");               
                var j = _h_list[0] * 1; 
                var k = _h_list[1] * 1;
                j = j + pos;  
                k = k + pos;        
                this.hiddenID = this.hiddenID + k +",";   
                tr.cells[j].style.display="none";  
            }
        }             
    
        var tr1 = this.tableElem.insertRow(rowIndex+1);
        for (var i = 0; i < cells.length; ++i) {
            field = cells[i];
            if (field[2] && field[2] != "hidden") {
                for (var j = 0; j < field[2].length; ++j) {
                    td = tr1.insertCell(j);   
                    td.align = "center"; 
                    td.innerHTML = field[2][j][0];
                    td.width = field[2][j][1];
                    td.className = "header";
                    td = null;
                }
            }
            field = null;
        }          
        this.header2 = tr1;
        
        field = null;
        td = null;
        return tr;        
    },
    getHeaderRowNum: function() {
        var num = 1;
        
        if (this.doHeaderInfo)
            num++;
                 
        if (this.header2)
            num++;     
        
        //auto test use            
        if (this.footer.rowIndex != (this.tableElem.rows.length - 1)){
            num++;
        }

        return num;                  
    },
    getNoDataRowNum: function() {
        var num = 1 + this.getHeaderRowNum();
        
        if (this.newEditor)
            num++;
                     
        return num;
    },
    // header
    headerClick: function(cell) {
        if (this.doSort && !this.newEditor && !this.editor) {
            this.sort(cell.cellN);
            this.updateRowIndex();
            
            if (this.doHeaderInfo)
                this.updateHeaderInfo();
        }
    },
    getTotalNum: function() {     
        return this.tableElem.rows.length - this.getNoDataRowNum();
    },
    updateFootInfo: function() {
        var html = this.getTotalNum();
        var total_num = window.lang.convert("Total Num", top.default_lang);
        html = total_num + ": " + html;
        this.footer.cells[0].innerHTML = html;
    },    
    selectPagNum: function(obj ){
        cookie.set('pageNum', obj.value);
        cookie.set('pageIndex', 1);   
        this.updateHeaderInfo();
    }, 
    selectPagIndex: function(obj){
        cookie.set('pageIndex', obj.value);     
        this.updateHeaderInfo();  
    },
    firstPage: function(){
        cookie.set('pageIndex', 1);  
        this.updateHeaderInfo();
    }, 
    prevPage: function(){
        var pageIndex = cookie.get('pageIndex');
        if (pageIndex == null) pageIndex = 1;

        pageIndex = pageIndex - 1;

        if (pageIndex < 1)
            cookie.set('pageIndex', 1); 
        else
            cookie.set('pageIndex', pageIndex); 
                
        this.updateHeaderInfo();
    },
    nextPage: function(){         
        var index = cookie.get('pageNum');
        if (index == null) index = 0;
        var pageIndex = cookie.get('pageIndex');
        if (pageIndex == null) pageIndex = 1;
        var num = this.getTotalNum();

        var pageNum = Math.ceil(num/this.numPage[index]); 

        pageIndex++;

        if (pageIndex > pageNum)
            cookie.set('pageIndex', pageNum);
        else                        
            cookie.set('pageIndex', pageIndex);
                
        this.updateHeaderInfo();
    },    
    lastPage: function(){
        var index = cookie.get('pageNum');
        if (index == null) index = 0;
        var num = this.getTotalNum();
        
        var pageNum = Math.ceil(num/this.numPage[index]);
            
        cookie.set('pageIndex', pageNum);  
        this.updateHeaderInfo();
    },    
    updateHeaderInfo: function() {
        var index = cookie.get('pageNum');
        if (index == null) index = 0;

        html ='<select onchange="finder.F_TABLE(this).selectPagNum(this)">';
        for (var i = 0; i < this.numPage.length; i++) {
           html +='<option value="'+i+'"';
           if (i == index)
                html +=' selected';
                        
           html +='>'+this.numPage[i]+'</option>';      
        }        
        
        html +='</select>&nbsp;&nbsp;per page';
        html +='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        html +='<img onclick="finder.F_TABLE(this).firstPage();" src="img/button_first.gif" title="First Page" class="color_WithHandPtr">';
        html +='<img onclick="finder.F_TABLE(this).prevPage();" src="img/button_back.gif" title="Prev Page" class="color_WithHandPtr">&nbsp';
          
        var pageIndex = cookie.get('pageIndex');
        if (pageIndex == null) pageIndex = 1;
        var num = this.getTotalNum();
          
        var pageNum = Math.ceil(num/this.numPage[index]);
        if (pageNum != 0 && pageIndex > pageNum)
        {
            pageIndex = pageNum;
            cookie.set('pageIndex', pageIndex); 
        }
          
        html +='<select onchange="finder.F_TABLE(this).selectPagIndex(this)">';
        for (var i = 1; i <= pageNum; i++)
        {
            html +='<option value="'+i+'"';
              
            if (i == pageIndex)
                html += 'selected';
              
            html +='>'+i+'</option>';    
        }
          
        html +='</select> page';
        html +='<img onclick="finder.F_TABLE(this).nextPage();" src="img/button_fw.gif" title="Next Page" class="color_WithHandPtr">';
        html +='<img onclick="finder.F_TABLE(this).lastPage();" src="img/button_last.gif" title="Last Page"  class="color_WithHandPtr">';        
        this.headerInfo.cells[0].innerHTML = html;
  
        var startIndex = (pageIndex - 1)* this.numPage[index];
        var endIndex = pageIndex * this.numPage[index];

        if (endIndex > this.getTotalNum())
            endIndex = this.getTotalNum();  
  
                   
        var headerRowNum = this.getHeaderRowNum();   
  
        for (var i = headerRowNum; i < this.tableElem.rows.length - 1 ; i++)
        {
            this.tableElem.rows[i].style.display = 'none';   
        }
        
        var n = (startIndex + headerRowNum);
        var m = (endIndex+headerRowNum);
        
        for (; n >= 0 && n < m; n++)
        {     
            this.tableElem.rows[n].style.display = '';     
        }
    
    },        
    initHeaderInfo: function() {
        var tr, td;
        tr = this.tableElem.insertRow(0);  
        td = tr.insertCell(0);
        
        td.colSpan = this.header.cells.length + this.extraCols; 
        
        var html;
        html ='<select onchange="finder.F_TABLE(this).selectPagNum(this)">';
        for (var i = 0; i < this.numPage.length; i++)
        {
            html +='<option value="'+i+'">'+this.numPage[i]+'</option>';      
        }
        html +='</select>&nbsp;&nbsp;per page';
        html +='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        html +='<img onclick="FirstPage();" src="img/button_first.gif" title="First Page" name="se_first" type="button" class="color_WithHandPtr">';
        html +='<img onclick="PrevPage();" src="img/button_back.gif" title="Prev Page" name="se_prev" type="button" class="color_WithHandPtr">&nbsp';
        html +='<select><option value="0">0</option></select> page';
        html +='<img onclick="NextPage();" src="img/button_fw.gif" title="Next Page" name="se_next" type="button" class="color_WithHandPtr">';
        html +='<img onclick="LastPage();" src="img/button_last.gif" title="Last Page" name="se_last" type="button" class="color_WithHandPtr">';    
        
        td.innerHTML = html;
        td.align = "right";                                    
        td.className = "headerInfo";
        
        cookie.set('pageNum', 0);
        cookie.set('pageIndex', 1);
        
        td = null;
        return tr;
    },
    initHeader: function(level,cells) {
        if (!cells) return;

        elem.rm(this.header);
        if (level == 0)
            this.header = this.insertRow(0, cells,1);
        else
            this.header = this.insertTwoRow(0, cells);
            
        var e = this.header; 
        e.className = 'header';
        
        //add onclick listen
        for (var i = 0; i < e.cells.length; ++i) {    
            e.cells[i].cellN = i;    
            e.cells[i].onclick = function() { finder.F_TABLE(this).headerClick(this); };
        }
        
        this.footer = this.createControls(this.tableElem.rows.length);
        
        if (this.doHeaderInfo)
            this.headerInfo = this.initHeaderInfo();

        return e;
    },
    editRow: function(cell) {
        var sr = finder.F_TR(cell);
        sr.style.display = 'none';        
        elem.rmClass(sr, 'hover');
        this.source = sr;
        var er = this.createEditor('edit', sr.rowIndex, sr);

        this.editor = er;    
        
        //focus first field
        var c = er.cells[cell.cellIndex || 0];
        e = c.getElementsByTagName('input');
        if ((e) && (e.length > 0)) {
            try {    // IE quirk
                e[0].focus();
            } catch (ex) { }
        }
        c = null;
        e = null;
        er = null;
        sr = null;
    },
    updateRowIndex: function(){
        var frontNum = this.getNoDataRowNum() - 1;
            
        for (var i=frontNum; i < this.tableElem.rows.length-1; i++)
        {
            this.tableElem.rows[i].cells[0].innerHTML = i- (frontNum) + 1;    
        }
    },
    rowClickEX: function(cell){
    
    },    
    rowClick: function(cell) {
        if (this.doEdit) {
            if (!this.verify(this.editor)) return;
                
            this.saveData();    
            if (this.rowClickURL == null) {
                this.editRow(cell);
            } else {
                this.rowClickEX(cell);
            }
        }else{
            this.rowClickEX(cell);  
        }
    },
    deleteClick: function(cell) {
        if (!this.verify(this.editor)) return;
                
        this.saveData();
        if(confirm('Do you want to delete this item?')) {
            elem.rm(finder.F_TR(cell));
        }
        this.updateRowIndex();
        this.updateFootInfo();
        if (this.doHeaderInfo)
            this.updateHeaderInfo();
    },
    showSource: function() {
        if (this.source) {
            this.source.style.display = '';
            this.source = null;
        }
    },
    removeEditor: function() {
        if (this.editor) {
            elem.rm(this.editor);
            this.editor = null;
            this.newEditor = null;
        }
    },
    addRow: function(rowIndex, cells) {        
        var e = this.insertRow(rowIndex, cells,0);    

        if (this.doEdit)
            e.className = 'rowC';

        for (i = 0; i < e.cells.length; ++i) {
            if (i== (e.cells.length - 1) && this.delHeader )
                e.cells[i].onclick = function() { finder.F_TABLE(this).deleteClick(this);};
            else
                e.cells[i].onclick = function() { finder.F_TABLE(this).rowClick(this);};
        }
        
        e._cells = cells;
        e.getRowData = function() { return this._cells; }
        e.setRowData = function(cells) { this._cells = cells; }
        
        if (this.doEdit) e.title = 'Click to edit or delete';    
        
        return e;
    },        
    addRowToLast: function(cells)
    {
        return this.addRow((this.tableElem.rows.length -1) ,cells);    
    },
    getOptionsName: function(cellIndex,value)
    {
        if (cellIndex < this.cellUIFields.length)
        {
            var ef = this.cellUIFields[cellIndex].multi;
            if (!ef) ef = [this.cellUIFields[cellIndex]];    
            
            for (var j = 0; j < ef.length; ++j) {
                var f = ef[j];
                        
                if (f.type == 'select')
                {
                    for (var k = 0; k < f.options.length; ++k) {
                        a = f.options[k];    
                            
                        if (a[0] == value)
                        {
                            ef = null; f = null;
                            return a[1];
                        }
                    }
                }else if (f.type == 'label')
                {
                    ef = null; f = null;
                    return f.options[value];                    
                }else if (f.type == 'checkbox')
                {
                    ef = null; f = null;
                    if (value == 1 || value == 'Y') {
                        return 'Y';
                    } else {
                        return 'N';
                    }
                }else if (f.type == 'password')
                {
                    value ="*******";
                }
                f = null;
            }
            ef = null;
        }
        
        return value;
    },
    createEditor: function(which, rowIndex, source) {
        var values;
        
        if (which == 'edit'){
            values = source.getRowData();
        }
            
        var tr = this.tableElem.insertRow(rowIndex);

        var action = ' onkeypress="return finder.F_TABLE(this).onKey(event)" onchange="finder.F_TABLE(this).onChange(\'' + which + '\', this)"';
        
        var vi = 0;
        var td;
        for (var i = 0; i < this.cellUIFields.length; ++i) {
            var s = '';
            var ef = this.cellUIFields[i].multi;
            if (!ef) ef = [this.cellUIFields[i]];
           
            var addRow = 1;

            for (var j = 0; j < ef.length; ++j) {
                var f = ef[j];    
                switch (f.type) {
                    case 'password':                    
                    case 'text':
                        s += '<input type='+ f.type + ' maxlength=' + f.maxlength + ' size=' + f.size + action + ((f.verify != null) ? ( ' verify=' + f.verify ): '' ) ;
                        
                        if (which == 'edit')
                            s += ' value="' + values[vi] + '">';
                        else 
                            s += '>';
                        break;

                    case 'select':
                        s += '<select >';
                        for (var k = 0; k < f.options.length; ++k) {
                            a = f.options[k];
                            defValue = f.value;
                            if (which == 'edit') {
                                s += '<option value="' + a[0] + '"' + ((a[0] == values[vi]) ? ' selected>' : '>') + a[1] + '</option>';
                            } else if (which == 'new') {
                                s += '<option value="' + a[0] + '"' + ((a[0] == defValue) ? ' selected>' : '>') + a[1] + '</option>';
                            } else {
                                s += '<option value="' + a[0] + '">' + a[1] + '</option>';
                            }
                        }
                        s += '</select>';
                        break;

                    case 'checkbox':
                        s += '<input type="checkbox" ';

                        if ((which == 'edit') && (values[vi] == 'Y' || values[vi] == '1' ) ) s += ' checked';

                        s += '>';
                        break;    
                    
                    case 'combine':
                        addRow = 0;
                        break;                    

                    case 'label':
                        s += '<input type="hidden" name="_Hidden" value="' + values[vi] + '">';
                    
                        if (values[vi]) s += f.options[values[vi]];    
                        break;

                    case 'hidden':
                    case 'instance':
                        s += '<input type="hidden" name="_Hidden"'; 
                        if (which == 'edit') {
                            s += ' value="' + values[vi] + '">';                 
                        } else {
                            if (f.type == 'hidden') {
                                s += '>';
                            } else {
                                s += ' value="' + this.instanceID + '">';
                                this.instanceID += 1;
                            }
                        }
                        break;

                    default:
                        break;
                }
                f = null;
            }
            
            if (addRow)
            {             
                td = tr.insertCell(vi);
                ++vi;
                td.align = "center";
                td.innerHTML = td.innerHTML  +  s;            
                
                if (this.hiddenID)
                {
                    var _i = i;
                                                                                                 
                    if (this.numHeader) _i++;
                                                                                                                       
                    var _hiddenID  = this.hiddenID.split(","); 
                    for (var j =0; j <_hiddenID.length; j++)
                    {
                        if (_hiddenID[j] !='')
                        {
                            var k = _hiddenID[j] * 1; 
                            if (k == _i)                        
                                td.style.display = "none";  
                        }
                    }                                                            
                }
                td = null;
            }

            ef = null;
        }    
        
        if (this.delHeader)
        {
            td = tr.insertCell(vi);    
            td.align = "center";
            td.innerHTML = '<a href="#" onclick=" return finder.F_TABLE(this).onDelete()" > <img border=0 src="img/trashcan.gif"></a>';
            td.width = 50;
            td = null;
        }
        
        if (this.numHeader)
        {
            td = tr.insertCell(0);        
            td.align = "center";
                
            if (which == 'edit'){
                td.innerHTML=source.cells[0].innerHTML;
            }else{
                td.innerHTML= this.tableElem.rows.length - this.getNoDataRowNum();        
            }
        }        
        
        return tr;    
    },
    onChange: function(which, cell) {

    },
    onKey: function(ev) {
        switch (ev.keyCode) {
            case 27:
                this.onCancel();
                return false;
            case 13:    
                this.onOK();
                return true;
        }
        return true;
    },
    onAdd: function() {
        if (!this.verify(this.editor)) return;
        
        this.saveData();
        if (this.getTotalNum() >= this.maxNum) {
            alert('Maximum number ' + this.maxNum);
            return;
        }
        this.newEditor= this.createEditor('new', (this.tableElem.rows.length -1), null);        
        this.editor = this.newEditor;
        var data2 = this.getFieldData(this.editor);            
        var str = this.addRowToLast(data2);
           
        this.source = str;
        str.style.display = 'none';
        this.updateFootInfo();
        if (this.doHeaderInfo) {
            this.lastPage();             
        }
        this.newEditor.style.display = '';
        data2 = null;
        str = null;
    },
    onOK: function() {
        if (!this.verify(this.editor)) return false;
        this.saveData();
        this.recolor();
        return true;
    },
    verify: function(row) {
        if (!row) return true;

        var e = elem.getAllFieldsData(row);

        var i;
        for (i = 0; i < e.length; ++i){ 
            if (!v_Field(e[i])) {
                e = null;
                return false;
            }
        }
        e = null;
        return true;
    },    
    onDelete: function() {
        this.removeEditor();
        elem.rm(this.source);
        this.source = null;
        this.updateFootInfo();
        if (this.doHeaderInfo) {
            this.updateHeaderInfo();             
        }        
        this.recolor();
    },

    saveData: function() {
        if (this.editor != null) {                    
            var flag = true;
            var data = this.getFieldData(this.editor);
            this.source.setRowData(data);
            
            var offset = 0;        
            if (this.numHeader) {
                this.source.cells[0].innerHTML = this.source.rowIndex - this.getHeaderRowNum();    
                offset = 1;
            }
            
            for (i = (0+offset); i < this.source.cells.length; ++i) {               
                var valueUI = this.getOptionsName(i-offset,data[i-offset]);                        
                this.source.cells[i].innerHTML = valueUI;
                if (data[i] != '')
                    flag = false;    
            }
            
            if (this.delHeader)
                this.source.cells[i-1].innerHTML = '<a href="#" ><img border=0 src="img/trashcan.gif"></a>';    
            
            if (flag)
                this.onDelete();    
                
            this.removeEditor();
            this.showSource(); 
            data = null;
        }
    },    
    onCancel: function() {
        if (this.editor) {
            elem.rm(this.editor);
            this.editor = null;
        }
        this.showSource();
    },
    createControls: function(rowIndex) {
        var row, c;
        row = this.tableElem.insertRow(rowIndex);
        var len =  this.header.cells.length;
        var controlHtml='';
        if(this.removeButton != 1)
        {
            if (!this.isFixedTable || this.btnAddURL) {
                controlHtml = '<input class="btnstyle" type=button value="';            
                if (this.addButtonName)
                    controlHtml += this.addButtonName+'"';
                else
                    controlHtml += 'Add"';
        
                controlHtml += ' onclick="finder.F_TABLE(this).onAdd()">';            
            }
        }
        
        if ((this.doEdit && !this.btnAddURL) || this.btnOKURL) {
            controlHtml += '<input class="btnstyle" type=button value="';            
            if (this.okButtonName)
                controlHtml += this.okButtonName+'"';
            else
                controlHtml += 'OK"';
             
            controlHtml += ' onclick="finder.F_TABLE(this).onOK()">';           
        }

        var td = row.insertCell(0);
        
        var totalCols = this.header.cells.length+  this.extraCols;
        var first,last;
        
        if (totalCols > 3)
        {
            first = totalCols - 2;
            last = 2;
        }else{
            first = totalCols - 1;
            last = 1;                    
        }
        td.className="tabletext";
        td.colSpan = first; 

        var total_num = window.lang.convert("Total Num", top.default_lang);

        td.innerHTML = total_num + ': 0';
        td.align = "left";
        td = null;
        
        td = row.insertCell(1);
        td.colSpan = last; 
        td.align = "right";
        td.innerHTML = controlHtml;
        td = null;

        return row;
    },
    isEditing: function() {
        return (this.editor != null);
    },
    getFieldData: function(row) {
        var e, i, data;
        data = [];
        e = elem.getAllFieldsData(row);
        for (i = 0; i < e.length; ++i){ 
            if (e[i].type == 'checkbox')
            {
                if (e[i].checked)
                {
                    data.push('Y');       
                }else{
                    data.push('N');
                }
            }else
                data.push(e[i].value);
        }
        e = null;
        return data;
    },
    sortCompare: function(a, b) {
        var obj = finder.F_TABLE(a);
        var col = obj.sortColumn;

        var r = cmpText(a.cells[col].innerHTML, b.cells[col].innerHTML);

        var ret = obj.sortAscending ? r : -r;
        obj = null;
        col = null;
        return ret;
    },
    resort: function() {
        var noDataRowsNum = this.getNoDataRowNum();
        
        if ((this.sortColumn < 0) || ((this.tableElem.rows.length - noDataRowsNum) == 0) || (this.editor)) return;

        var p = this.header.parentNode;
        var a = [];
        var i, j, max, e, p;
        var top;
        
        var headerRowsNum = this.getHeaderRowNum();
 
        top = this.header ? this.header.rowIndex + (headerRowsNum - 1) : 0;
        max = this.footer ? this.footer.rowIndex : this.tableElem.rows.length;
        
        for (i = top; i < max; ++i) 
            a.push(p.rows[i]);    
        a.sort(THIS(this, this.sortCompare));
        this.removeAllData(1);
        
        j = top;
        for (i = 0; i < a.length; ++i) {
            e = p.insertBefore(a[i], this.footer);                                        
            e.className = (j & 1) ? 'even' : 'odd';                    
            ++j;
            e = null;
        }
        e = null;
    },
    sort: function(column) {
        if (this.numHeader && column == 0) return;
        if (this.delHeader && column == (this.header.cells.length - 1)) return;
        if (this.header.cells[column].colSpan > 1 ) return;
        if (this.editor) return;

        if (this.sortColumn >= 0) {
            elem.rmClass(this.header.cells[this.sortColumn], 'sortasc', 'sortdes');
        }
        if (column == this.sortColumn) {
            this.sortAscending = !this.sortAscending;
        }
        else {
            this.sortAscending = true;
            this.sortColumn = column;
        }
        
        elem.addClass(this.header.cells[column], this.sortAscending ? 'sortasc' : 'sortdes');

        this.resort();
        this.recolor();
    },
    removeAllData: function(type) {
        var i, count;
        
        i = this.getHeaderRowNum();

        count = (this.footer ? this.footer.rowIndex : this.tableElem.rows.length) - i;

        while (count-- > 0){ 
            this.tableElem.deleteRow(i);
        }
    },
    getAllData: function() {
        var i, max, data, r;

        data = [];
        max = this.tableElem.rows.length;

        for (i = (this.header.rowIndex + 1); i < max; ++i) {
            r = this.tableElem.rows[i];
            if ((r._cells)) data.push(r._cells);
            r = null;
        }
        r = null;
        return data;
    },
    recolor: function() {
        var i, e, o;
        
        i = this.header ? this.header.rowIndex + 1 : 0;
        i = this.header2 ? i + 1 : i;
        e = this.footer ? this.footer.rowIndex : this.tableElem.rows.length;
         
        var index = ( i & 1 )? i+1 : i;

        for (; i < e; ++i) {
            o = this.tableElem.rows[i];
            o.className = (index & 1) ? 'even' : 'odd';
            index++;
            o = null;
        }
        o = null;
    },
    setRowColor: function(rid){
        this.recolor();
        var i, e, o;
        rid = rid + this.getHeaderRowNum();
        
        var o = this.tableElem.rows[rid];   
        o.className = 'selected';
        o = null;
    }
}

function escapeHTML(s)
{
    function esc(c) {
        return '&#' + c.charCodeAt(0) + ';';
    }
    return s.replace(/[&"'<>\r\n]/g, esc);
}

function THIS(obj, func)
{
    return function() { return func.apply(obj, arguments); }
}

function cmpText(a, b)
{
    if (a == '') a = '\xff';
    if (b == '') b = '\xff';
    return (a < b) ? -1 : ((a > b) ? 1 : 0);
}

Array.prototype.find = function(v) {
    for (var i = 0; i < this.length; ++i)
        if (this[i] == v) return i;
    return -1;
}

Array.prototype.remove = function(v) {
    for (var i = 0; i < this.length; ++i) {
        if (this[i] == v) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
}

var elem = {
    rmClass: function(e_id, name) {
        var e;
        if ((e = doc.E(e_id)) == null) return;
        var a = e.className.split(/\s+/);
        var k = 0;
        for (var i = 1; i < arguments.length; ++i)
            k |= a.remove(arguments[i]);
        if (k) e.className = a.join(' ');
        e = null;
    },
    addClass: function(e_id, name) {
        var e;
        if ((e = doc.E(e_id)) == null) return;
        var a = e.className.split(/\s+/);
        var k = 0;
        for (var i = 1; i < arguments.length; ++i) {
            if (a.find(arguments[i]) == -1) {
                a.push(arguments[i]);
                k = 1;
            }
        }
        if (k) e.className = a.join(' ');
        e = null;
    },    
    rm: function(e_id) {  //remove element
        var e = doc.E(e_id);
        if (e != null) {
            var i = e.cells.length;
	    while(--i>=0) {
                e.cells[i].onclick = function() {};
                e.deleteCell(i);
            }                
            e._cells = null;
            e.getRowData = function() {};
            e.setRowData = function() {};                             
            e.parentNode.removeChild(e);    
            e = null;                           
        }     
    },
    rm2: function(e_id) {  //remove element
        var e = doc.E(e_id);
        if (e != null)
            e.parentNode.removeChild(e);
        e = null;
    },    
    findElem: function(e_id, tagName) {
        var e = doc.E(e_id);
        tagName = tagName.toUpperCase();
        while (e.parentNode) {
            e = e.parentNode;
            if (e.tagName == tagName) return e;
        }
        e = null;
        return null;
    },
    getAllFieldsData: function(e) {
        var a = [];
        switch (e.tagName) {
            case 'INPUT':
            case 'SELECT':
                a.push(e);
                break;
            default:
                if (e.childNodes) {
                    for (var i = 0; i < e.childNodes.length; ++i) {
                        a = a.concat(elem.getAllFieldsData(e.childNodes[i]));
                    }
                }
        }
        return a;
    }
};
