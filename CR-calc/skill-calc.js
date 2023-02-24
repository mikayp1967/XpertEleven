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
                percentages[x] = parseInt(document.getElementById("ChngPct" + (x+1)).value);
        }

// Test for each possible current skill level
        for(var i = getMax(skills[0])*10; i >= getMin(skills[0])*10; i--)
        {
    Historic=CheckValid(0,(i/10));
    if(Historic != "")
                {
//      if (SkillPaths.length == 0) {HighSkill=i/10;}
//      LowSkill=i/10;
       if (SkillPaths.length == 0) {HighSkill=parseInt(i)/10;}
      LowSkill=parseInt(i)/10;
                       SkillPaths.push(Historic);
                        result = true;
                }
        }

        if (result)
        {

                for(var SP=0; SP<SkillPaths.length; SP++)
                {
      CurrSP= SkillPaths[SP];
      CurrSP="<b>" + CurrSP.replace(/>/, "</B>&nbsp;&nbsp;> ");     // Should just replace first instance to bolden current skill

      SkillsMess= SkillsMess + CurrSP + "<br>" ;
       }

   SkillNextBar=getMin(skills[0]+1);
   SkillsMess= SkillsMess + "<br>" ;
   SkillsMess=SkillsMess + "Next bar: " + SkillNextBar + "<br>";

   DVLow=CheckDV(PlayerAge,SkillNextBar-HighSkill-0.2);
   DVHigh=CheckDV(PlayerAge,SkillNextBar-LowSkill);
   SkillsMess=SkillsMess+ "Approx DV needed to gain a bar between " + DVLow + " & " + (DVHigh) +"<br>";
   if (PlayerAge <26) 
    {
    SkillNextBar=getMin(skills[0]+2);
    DJDV=CheckDV(PlayerAge,SkillNextBar-HighSkill-0.2);
    if (DJDV <=20 & PlayerAge < 26 )
     {
     SkillsMess=SkillsMess+ "Double jump may be possible at a minimum " + DJDV + " DV<br>";
 
     }
    }




// If 4+ datapoints check how good development has been so far & predict player skill.
 if (PlayerAge >= 20 && PlayerAge < 27)
  {
  if (skills[4] >0) 
   {
    AccumSkill=0;
    GuessCurrSkill=((HighSkill + LowSkill)/2);
    GuessStartSkill=GuessCurrSkill;
    for (var x=0; x<4; x++)
     {
     AccumSkill=AccumSkill+BaseCRPerf(PlayerAge-x-1);
     GuessStartSkill=(100* GuessStartSkill / (100+parseInt(percentages[x])));
//     GuessStartSkill=100+parseInt(percentages[x]);
     }

     if (AccumSkill > 1)
      {
      DevQuality=((GuessCurrSkill-GuessStartSkill)/AccumSkill);
      if (DevQuality > 1.3) DevStandard="stellar";
      else if (DevQuality > 1.15) DevStandard="good";
      else if (DevQuality > 0.9) DevStandard="average";
      else if (DevQuality > 0.8) DevStandard="poor";
      else DevStandard="dire";

      SkillPredict=GuessCurrSkill;
      for (var x=0; x<(32-PlayerAge); x++)
       {
       if ((PlayerAge+x) < 26) SkillPredict=SkillPredict+(BaseCRPerf(PlayerAge+x) * DevQuality);
       else SkillPredict=SkillPredict+(BaseCRPerf(PlayerAge+x));   // No real boost to skill if over 26
       }  
      SkillPredict=parseInt(SkillPredict); 
// alert ( AccumSkill + " / " +  (GuessCurrSkill-GuessStartSkill) + " / " + DevQuality); 
     SkillsMess=SkillsMess+"<br>This player's development has been " + DevStandard + " so far and he could be expected to peak around " + SkillPredict + "-" + (SkillPredict+1) + " bars.<br>";
    }



   }
  }

     SkillsMess=SkillsMess+ "<br><br><b>Note: These figures are an estimate only and skill change from DV values can vary significantly.</b><br>";


        }
        else SkillsMess="<h2>Unable to determine exact skill level. Please recheck the data.</h2>";

  tinymce.get('CRData').setContent(SkillsMess);
}



function BaseCRPerf(PlyAge)
// Return a "average" CR figure for a player of a given age. Based on 16 DV for <26, 14-15DV for 26-31
 {
 if (PlyAge <=20) return 1.1;
 else if (PlyAge <=22) return 1.;
 else if (PlyAge <=25) return 0.9;
 else if (PlyAge <=28) return 0.5;
 else if (PlyAge <=31) return 0.25;
}




function CheckDV(PlyAge, Shortfall)
// Check DV required to gain a bar for a given skill
{
 var DVCalc=0;

 Shortfall= (Shortfall + 0.01)   // Somehow does the rounding wrong, this should fix (for now)
 if (PlyAge  <= 20) 
  {

 if (Shortfall < 0.9) DVCalc=Math.round(Shortfall*6);
 else if (Shortfall <= 1) DVCalc=5;
 else if (Shortfall <= 1.1) DVCalc=6;
 else if (Shortfall <= 1.3) DVCalc=7;
 else if (Shortfall <= 1.4) DVCalc=8;
 else if (Shortfall <= 1.5) DVCalc=9;    
 else if (Shortfall <= 1.6) DVCalc=10;    
 else DVCalc=99;        // Unattainable 

  }
 else if (PlyAge  <= 22) 
  {
 if (Shortfall < 0.8) DVCalc=Math.round(Shortfall*6.5);
 else if (Shortfall <= 0.9) DVCalc=5;
 else if (Shortfall <= 1) DVCalc=6;
 else if (Shortfall <= 1.1) DVCalc=7;
 else if (Shortfall <= 1.2) DVCalc=8;
 else if (Shortfall <= 1.4) DVCalc=9;    
 else if (Shortfall <= 1.5) DVCalc=10;    
 else DVCalc=99;        // Unattainable 
  }
 else if (PlyAge  <= 25) 
  {

 if (Shortfall < 0.7) DVCalc=Math.round(Shortfall*7.2);
 else if (Shortfall <= 0.7) DVCalc=5;
 else if (Shortfall <= 0.8) DVCalc=6;
 else if (Shortfall <= 1.0) DVCalc=7;
 else if (Shortfall <= 1.1) DVCalc=8;
 else if (Shortfall <= 1.2) DVCalc=9;    
 else if (Shortfall <= 1.3) DVCalc=10;    
 else DVCalc=99;        // Unattainable 

  }
 else if (PlyAge  <= 28) 
  {
  DVCalc=parseInt(Shortfall*10);
  }
 else if (PlyAge  <= 31) 
  {
  DVCalc=parseInt(Shortfall*15);
  }
 else
 DVCalc=99;

 if (DVCalc < 0) DVCalc=0;     // This is to set a baseline 10DV if it's just random factor change.

 if (DVCalc > 10)
  return "<b>Impossible</b>"; 
 else
  return (DVCalc+10);

}
 



function CheckValid(El, Est_Value)
{
// Check the passed element of the array of skill/pct values for to see if the estimated value works
// If it does then recursively check again
// Each recursion returns the value that worked - added to the current value - for historical value data.
// "false" return is empty string. 


  var RetVal;
// Reached the end? Then it's perfecto.
  if(isNaN(skills[El+1]) || isNaN(percentages[El]))
  return "/";      // Fake non-false return.

  var MinV;
  var MaxV;
  var PossValue;

// Find min/max values to check based on next element skill - mult by 10 for ease of looping
  MinV=getMin(skills[El+1])*10;
  MaxV=getMax(skills[El+1])*10;

  for (var x=MinV; x <=MaxV; x++)
  {
   PossValue=(x/10);
   if(TestValid(Est_Value,PossValue, percentages[El]))
   {   // We have a hit - so we need to do 1 more level down
    RetVal=CheckValid(El+1, PossValue);
    if (RetVal !="")            // Must have checked fully to the bottom so this is a good un
     if (RetVal == "/" )
      return (Est_Value + "  >  " + PossValue);     // Last one - so use the last prev value checked. 
     else
      return (Est_Value + "  >  " + RetVal) ;
    
   }
  }
// If we are here nothing went all the way down - no match
 return "";
}






function getMax(skill)
{
 if(skill % 2 == 0)
  return skill + 0.5;
 else
  return skill + 0.4;
}





function getMin(skill)
{
 if(skill % 2 == 0)
  return (skill - 0.5);
 else
  return (skill - 0.4);
}


function TestValid(newVal, oldVal, percentage)
{
 divisor = ((newVal / oldVal)-1) * 100;

 if (RoundEven(divisor) == percentage)
  return true;
 else
  return false;
}





function RoundEven(val)
{
 var IntVal=Math.floor(val);
 
 if (IntVal%2 == 0)
  return (Math.round(val-0.01));
 else
  return (Math.round(val));
}





function ReadData()
{
// First clear the existing data
 ClearData("");
 PlayerAge=0;   // No player age set

 var lines=tinymce.get('CRData').getContent();
 var eachline=lines.split('\n');
 var AgeLine=9999;
 var GuessStartSkill;

// Now read the skill/% values from the text area
 var yearback=0;
 var stringfound;
 var templine;

  for (var x=0; x<eachline.length; x++)
  {
    stringfound = eachline[x].search("span title");
    if (stringfound > 0)
    {
      templine= eachline[x].slice(stringfound+12,stringfound+14);
      templine=templine.replace(/"/g, "")
      document.getElementById("skill" +(yearback+1)).value = templine;
  }

    stringfound = eachline[x].search("dgCRPlayer_");
    if (stringfound > 0)
    {
      stringfound = eachline[x].search("%");
      templine= eachline[x].slice(stringfound-2,stringfound);
      templine=templine.replace(/>/g, "");
      document.getElementById("ChngPct" +(yearback+1)).value = templine;
      if (yearback == 0 )   // Capture 1st occurence of player age
      {
       AgeLine=(x + 1);
       templine= eachline[x+1];
       stringfound = templine.search(">[0-9][0-9]");
       PlayerAge=parseInt(templine.slice(stringfound+1,stringfound+3));
      }
   yearback++;
// Should really add check for however many lines there are and dive out
  }

 }

// 27/7/14 - Check for only 1 datapoint. Guestimate original point and alert.
 if (yearback == 1)
  {
  GuessStartSkill=Math.round((document.getElementById("skill1").value * 100) / (100 + parseInt(document.getElementById("ChngPct1").value)));
  document.getElementById("skill2").value=GuessStartSkill;

  templine="Only 1 datapoint entered. Starting skill guessed as " + GuessStartSkill + ".\nPlease correct manually if this is wrong.";
  alert (templine);
  }


}




function ClearData(InputWin)
{
 for(var el=0; el<12; el++)
 {
  document.getElementById("skill" + (el+1)).value = "";
  document.getElementById("ChngPct" + (el+1)).value = "";
 }
 if (InputWin == "ALL")
  {
   tinymce.get('CRData').setContent("Paste CR data here") ;

 }
}





</script>
</head><body>

<h2>
Xpert Eleven Change Report Skill Calculator - Looks like how javascript works changed a few years ago, I'm looking into it</h2>
Updated 20/11/22<br>
<hr />

<h3>Instructions:</h3>
Cut and paste the player's skill data from their CR history page into the textbox.<br /><br />
Press "Read Data" to strip out the CR data.<br />
Press "Calculate" to check the player's exact skill.<br /><br />
<b>If the data window disappears just refresh the screen F5</b><br />
Click <a href="http://xperteleven-guide.blogspot.co.uk/p/cr-calc-instructions.html" target="_blank">here</a> for more detailed instructions.<br />
<br />


<br />
<textarea cols="50" name="CRData" rows="13">
</textarea>
<br />
<input onclick="ReadData()" type="button" value="Read Data" />
<input onclick="calc()" type="button" value="Calculate" />
<input onclick="ClearData('ALL')" type="button" value="Clear All" />


<table>
<tr>
 <td>Skill</td>
 <td>Percentage</td>
</tr>
<tr>
 <td><input id="skill1" type="text" /></td>
 <td><input id="ChngPct1" type="text" /></td>
</tr>
<tr>
 <td><input id="skill2" type="text" /></td>
 <td><input id="ChngPct2" type="text" /></td>
</tr>
<tr>
 <td><input id="skill3" type="text" /></td>
 <td><input id="ChngPct3" type="text" /></td>
</tr>
<tr>
 <td><input id="skill4" type="text" /></td>
 <td><input id="ChngPct4" type="text" /></td>
</tr>
<tr>
 <td><input id="skill5" type="text" /></td>
 <td><input id="ChngPct5" type="text" /></td>
</tr>
<tr>
 <td><input id="skill6" type="text" /></td>
 <td><input id="ChngPct6" type="text" /></td>
</tr>
<tr>
 <td><input id="skill7" type="text" /></td>
 <td><input id="ChngPct7" type="text" /></td>
</tr>
<tr>
 <td><input id="skill8" type="text" /></td>
 <td><input id="ChngPct8" type="text" /></td>
</tr>
<tr>
 <td><input id="skill9" type="text" /></td>
 <td><input id="ChngPct9" type="text" /></td>
</tr>
<tr>
 <td><input id="skill10" type="text" /></td>
 <td><input id="ChngPct10" type="text" /></td>
</tr>
<tr>
 <td><input id="skill11" type="text" /></td>
 <td><input id="ChngPct11" type="text" /></td>
</tr>
<tr>
 <td><input id="skill12" type="text" /></td>
 <td><input id="ChngPct12" type="text" /></td>
</tr>
</table>
</body></html>
