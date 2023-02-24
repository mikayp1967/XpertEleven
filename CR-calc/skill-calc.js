<html xmlns="http://www.w3.org/1999/xhtml"><head>


<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-tinymce/0.0.19/tinymce.min.js" type="text/javascript"></script>
<script type="text/javascript">
tinymce.init({
     selector: "textarea",
    plugins: [
         "advlist autolink lists link image charmap print preview anchor",
         "searchreplace visualblocks code fullscreen",
     ],
 toolbar: false,
     menubar : false,
 statusbar: false
 });
</script>



<script type="text/javascript">


// These should now be global variables
  var skills = new Array();
  var percentages = new Array();
  var PlayerAge;



function TestCode1()
{
// Test routine
 var TestMess="Test Message";

// tinymce.get('CRData').setContent(TestMess) ;

 skill1.value=6;
 ChngPct1.value=25;
 skill2.value=5;
}





//Function to calculate current skill
function calc()
{
 
     var result = false;
        var SkillPaths = new Array();
  var Historic;
  var SkillsMess = "<h2>Possible current + historic values:</h2><br>";
  var CurrSP;
  var LowSkill=0;
  var HighSkill=0;
 var AccumSkill;
 var GuessStartSkill;
 var GuessCurrSkill;
 var DevStandard;
 var SkillPredict;

        for(var x=0; x<12; x++)
        {
                skills[x] = parseInt(document.getElementById("skill" + (x+1)).value);

