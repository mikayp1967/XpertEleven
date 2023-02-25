<html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <script type="text/javascript">
      // These should now be global variables
      var skills = new Array();
      var percentages = new Array();
      var PlayerAge;

      function TestCode1() {
        // Test routine
        var testMess = 'Testing...\n';
        document.getElementById("Status").innerHTML = testMess

        skill1.value = 11;
        ChngPct1.value = 13;
        skill2.value = 10;
        ChngPct2.value = 13;
        skill3.value = 9;
        ChngPct3.value = 18;
        skill4.value = 7;
        ChngPct4.value = 9;
        skill5.value = 7;
        ChngPct5.value = 22;
        skill5.value = 6;

        AgeBox.value=23
      }

      function TestCode2() {
        // Test routine
        var testMess = document.getElementById("CRData").innerHTML;
        
        document.getElementById("Status").value = testMess;
        document.getElementById("Status").value += "testing";
		    AgeBox.value ="Testing";
      }

      //Function to calculate current skill
      function calc() {

        var result = false;
        var SkillPaths = new Array();
        var Historic;
        var skillsMess = "<b>Possible current + historic values:</b><br><br>";
        var CurrSP;
        var LowSkill = 0;
        var HighSkill = 0;
        var AccumSkill;
        var GuessStartSkill;
        var GuessCurrSkill;
        var DevStandard;
        var SkillPredict;

        const statusArea = document.getElementById("Status");
              

        for (var x = 0; x < 12; x++) {
          skills[x] = parseInt(document.getElementById("skill" + (x + 1)).value);
          percentages[x] = parseInt(document.getElementById("ChngPct" + (x + 1)).value);
        }
        PlayerAge=AgeBox.value;

        // Test for each possible current skill level
        for (var i = getMax(skills[0]) * 10; i >= getMin(skills[0]) * 10; i--) {
          Historic = CheckValid(0, (i / 10));
          if (Historic != "") {
            //      if (SkillPaths.length == 0) {HighSkill=i/10;}
            //      LowSkill=i/10;
            if (SkillPaths.length == 0) {
              HighSkill = parseInt(i) / 10;
            }
            LowSkill = parseInt(i) / 10;
            SkillPaths.push(Historic);
            result = true;
          }
        }

        if (result) {

          for (var SP = 0; SP < SkillPaths.length; SP++) {
            CurrSP = SkillPaths[SP];
            CurrSP = "<b>" + CurrSP.replace(/>/, "</b>&nbsp;&nbsp;> "); // Should just replace first instance to bolden current skill
            skillsMess = skillsMess + CurrSP + "<br>";
          }

          SkillNextBar = getMin(skills[0] + 1);
          skillsMess = skillsMess + "<br>";
          skillsMess = skillsMess + "Next bar: " + SkillNextBar + "<br>";

          DVLow = CheckDV(PlayerAge, SkillNextBar - HighSkill - 0.2);
          DVHigh = CheckDV(PlayerAge, SkillNextBar - LowSkill);
          skillsMess = skillsMess + "Approx DV needed to gain a bar between " + DVLow + " & " + (DVHigh) + "<br>";
          if (PlayerAge < 26) {
            SkillNextBar = getMin(skills[0] + 2);
            DJDV = CheckDV(PlayerAge, SkillNextBar - HighSkill - 0.2);
            if (DJDV <= 20 & PlayerAge < 26) {
              skillsMess = skillsMess + "Double jump may be possible at a minimum " + DJDV + " DV<br>";

            }
          }

          // If 4+ datapoints check how good development has been so far & predict player skill.
          if (PlayerAge >= 20 && PlayerAge < 27) {
            if (skills[4] > 0) {
              AccumSkill = 0;
              GuessCurrSkill = ((HighSkill + LowSkill) / 2);
              GuessStartSkill = GuessCurrSkill;
              for (var x = 0; x < 4; x++) {
                AccumSkill = AccumSkill + BaseCRPerf(PlayerAge - x - 1);
                GuessStartSkill = (100 * GuessStartSkill / (100 + parseInt(percentages[x])));
                 
              }
              

              if (AccumSkill > 1) {
                DevQuality = ((GuessCurrSkill - GuessStartSkill) / AccumSkill);
                if (DevQuality > 1.3) DevStandard = "stellar";
                else if (DevQuality > 1.15) DevStandard = "good";
                else if (DevQuality > 0.9) DevStandard = "average";
                else if (DevQuality > 0.8) DevStandard = "poor";
                else DevStandard = "dire";
                statusArea.value += `Guessing skills Starting : ${GuessStartSkill}  Current: ${GuessCurrSkill}\n` 
                statusArea.value += `Development quality : ${DevQuality}\n` 

                SkillPredict = GuessCurrSkill;
                
                var BCRP;
                for (var x = 0; x < (32 - PlayerAge); x++) {
                  BCRP=BaseCRPerf(+PlayerAge + +x);
                  if ((+PlayerAge+ +x) < 26) SkillPredict = SkillPredict + (BaseCRPerf(+PlayerAge) * DevQuality);
                  else SkillPredict = SkillPredict + (BaseCRPerf(+PlayerAge+ +x)); 
                  statusArea.value += `Predicted skill at ${PlayerAge}+${x}: ${SkillPredict}  BCRP: ${BCRP}\n`
                }
                statusArea.value += `Pedicted peak skill : ${SkillPredict}\n` 
                SkillPredict = parseInt(SkillPredict);
                // alert ( AccumSkill + " / " +  (GuessCurrSkill-GuessStartSkill) + " / " + DevQuality); 
                skillsMess = skillsMess + "<br>This player's development has been " + DevStandard + " so far and he could be expected to peak around " + SkillPredict + "-" + (SkillPredict + 1) + " bars.<br>";
              }

            }
          }

          skillsMess = skillsMess + "<br><br><b>Note: These figures are an estimate only and skill change from DV values can vary significantly.</b><br>";

        } else skillsMess = "<h2>Unable to determine exact skill level. Please recheck the data.</h2>";

        var unformatedMess;
        unformattedMess = skillsMess;
        unformattedMess = unformattedMess.replace(/<h2>|<\/h2>/g, "");
        unformattedMess = unformattedMess.replace(/<br>/g, "\n");
        unformattedMess = unformattedMess.replace(/<b>|<\/b>/g, "");
        document.getElementById("CRData").innerHTML = skillsMess;
      }

      function BaseCRPerf(PlyAge)
      // Return a "average" CR figure for a player of a given age. Based on 16 DV for <26, 14-15DV for 26-31
      {

        if (PlyAge <= 20) return 1.1;
        else if (PlyAge <= 22) return 1.;
        else if (PlyAge <= 25) return 0.9;
        else if (PlyAge <= 28) return 0.5;
        else if (PlyAge <= 31) return 0.25;
        else if (PlyAge <= 34) return 0.1;
        else return 0;
      }

      function CheckDV(PlyAge, Shortfall)
      // Check DV required to gain a bar for a given skill
      {
        const statusArea = document.getElementById("Status");
        statusArea.value += `Testing ability to gain a bar. Age: ${PlyAge}  Shortfall: ${Shortfall}\n`
        var DVCalc = 0;

        Shortfall = (Shortfall + 0.01) // Somehow does the rounding wrong, this should fix (for now)
        if (PlyAge <= 20) {

          if (Shortfall < 0.9) DVCalc = Math.round(Shortfall * 6);
          else if (Shortfall <= 1) DVCalc = 5;
          else if (Shortfall <= 1.1) DVCalc = 6;
          else if (Shortfall <= 1.3) DVCalc = 7;
          else if (Shortfall <= 1.4) DVCalc = 8;
          else if (Shortfall <= 1.5) DVCalc = 9;
          else if (Shortfall <= 1.6) DVCalc = 10;
          else DVCalc = 99; // Unattainable 

        } else if (PlyAge <= 22) {
          if (Shortfall < 0.8) DVCalc = Math.round(Shortfall * 6.5);
          else if (Shortfall <= 0.9) DVCalc = 5;
          else if (Shortfall <= 1) DVCalc = 6;
          else if (Shortfall <= 1.1) DVCalc = 7;
          else if (Shortfall <= 1.2) DVCalc = 8;
          else if (Shortfall <= 1.4) DVCalc = 9;
          else if (Shortfall <= 1.5) DVCalc = 10;
          else DVCalc = 99; // Unattainable 
        } else if (PlyAge <= 25) {

          if (Shortfall < 0.7) DVCalc = Math.round(Shortfall * 7.2);
          else if (Shortfall <= 0.7) DVCalc = 5;
          else if (Shortfall <= 0.8) DVCalc = 6;
          else if (Shortfall <= 1.0) DVCalc = 7;
          else if (Shortfall <= 1.1) DVCalc = 8;
          else if (Shortfall <= 1.2) DVCalc = 9;
          else if (Shortfall <= 1.3) DVCalc = 10;
          else DVCalc = 99; // Unattainable 

        } else if (PlyAge <= 28) {
          DVCalc = parseInt(Shortfall * 10);
        } else if (PlyAge <= 31) {
          DVCalc = parseInt(Shortfall * 15);
        } else DVCalc = 99;

        if (DVCalc < 0) DVCalc = 0; // This is to set a baseline 10DV if it's just random factor change.

        if (DVCalc > 10) return "<b>Impossible</b>";
        else return (DVCalc + 10);

      }

      function CheckValid(El, Est_Value) {
        // Check the passed element of the array of skill/pct values for to see if the estimated value works
        // If it does then recursively check again
        // Each recursion returns the value that worked - added to the current value - for historical value data.
        // "false" return is empty string. 

        var RetVal;
        // Reached the end? Then it's perfecto.
        if (isNaN(skills[El + 1]) || isNaN(percentages[El])) return "/"; // Fake non-false return.

        var MinV;
        var MaxV;
        var PossValue;

        // Find min/max values to check based on next element skill - mult by 10 for ease of looping
        MinV = getMin(skills[El + 1]) * 10;
        MaxV = getMax(skills[El + 1]) * 10;

        for (var x = MinV; x <= MaxV; x++) {
          PossValue = (x / 10);
          if (TestValid(Est_Value, PossValue, percentages[El])) { // We have a hit - so we need to do 1 more level down
            RetVal = CheckValid(El + 1, PossValue);
            if (RetVal != "") // Must have checked fully to the bottom so this is a good un
            if (RetVal == "/") return (Est_Value + "  >  " + PossValue); // Last one - so use the last prev value checked. 
            else return (Est_Value + "  >  " + RetVal);

          }
        }
        // If we are here nothing went all the way down - no match
        return "";
      }

      function getMax(skill) {
        if (skill % 2 == 0) return skill + 0.5;
        else return skill + 0.4;
      }

      function getMin(skill) {
        if (skill % 2 == 0) return (skill - 0.5);
        else return (skill - 0.4);
      }

      function TestValid(newVal, oldVal, percentage) {
        divisor = ((newVal / oldVal) - 1) * 100;

        if (RoundEven(divisor) == percentage) return true;
        else return false;
      }

      function RoundEven(val) {
        var IntVal = Math.floor(val);

        if (IntVal % 2 == 0) return (Math.round(val - 0.01));
        else return (Math.round(val));
      }

      function ReadData() {
        // First clear the existing data
        ClearData("");
        var PlayerAge = 0; // No player age set

        //var lines = tinymce.get('CRData').getContent();
        var lines = document.getElementById("CRData").innerHTML;
        var eachline = lines.split('</tr>');
        var AgeLine = 9999;
        var GuessStartSkill;
        var spanElem;
        var titleValue;
        var tempElem = document.createElement('div');
        var fourthTableCell;

        // Now read the skill/% values from the text area
        var yearback = 0;
        var stringfound;
        var templine;
        const statusArea = document.getElementById("Status");
        
        for (var x = 0; x < eachline.length; x++) {
          stringfound = eachline[x].indexOf("title=");
          if (stringfound >= 0) {
            //statusArea.value += `Parsing: ${eachline[x]}\n`        
	 		  var tempElem = document.createElement('div');
              tempElem.innerHTML = eachline[x]; 
            			statusArea.value += `tempElem-1 : ${tempElem}\n`
            spanElem = tempElem.querySelector('span[title]');
            titleValue = spanElem.getAttribute('title');

             			statusArea.value += `Span Element: ${spanElem}\n`;
               			statusArea.value += `Title Value:: ${titleValue}\n`;
            document.getElementById("skill" + (yearback + 1)).value = titleValue;
            if (yearback == 0) {
			  PlayerAge = tempElem.textContent.replace(/.*%/g, "");
              AgeBox.value=PlayerAge;
            }            
          }

          stringfound = eachline[x].indexOf("dgCRPlayer_");
          if (stringfound >= 0) {
            stringfound = eachline[x].indexOf("%");
            templine = eachline[x].slice(stringfound - 2, stringfound);
            templine = templine.replace(/>/g, "");
            document.getElementById("ChngPct" + (yearback + 1)).value = templine;

            yearback++;

            // Should really add check for however many lines there are and break out
          }
        }

        // 27/7/14 - Check for only 1 datapoint. Guestimate original point and alert.
        if (yearback == 1) {
          GuessStartSkill = Math.round((document.getElementById("skill1").value * 100) / (100 + parseInt(document.getElementById("ChngPct1").value)));
          document.getElementById("skill2").value = GuessStartSkill;

          templine = "Only 1 datapoint entered. Starting skill guessed as " + GuessStartSkill + ".\nPlease correct manually if this is wrong.";
          alert(templine);
        }
      }

      function ClearData(InputWin) {
        for (var el = 0; el < 12; el++) {
          document.getElementById("skill" + (el + 1)).value = "";
          document.getElementById("ChngPct" + (el + 1)).value = "";
        }
        if (InputWin == "ALL") {
          document.getElementById("CRData").innerHTML = "Paste CR data here";

        }
      }
    </script>
  </head>
  
  <body>


    <br />
    <hr />
    <h3>
      Instructions:
    </h3>
    Cut and paste the player's skill data from their CR history page into
    the textbox.
    <br />
    <br />
    Press "Read Data" to strip out the CR data.
    <br />
    Press "Calculate" to check the player's exact skill.
    <br />
    <br />
    <b>
      If the data window disappears just refresh the screen F5
    </b>
    <br />
    Click
    <a href="http://xperteleven-guide.blogspot.co.uk/p/cr-calc-instructions.html" target="_blank">
      here
    </a>
    for more detailed instructions.
    <br />
    <br />
    <br />
    <div contenteditable="true" id="CRData" style="border: 1px solid black; height: 22em; overflow: auto; width: 60ch;">
    </div>
    <br />
    <input onclick="ReadData()" type="button" value="Read Data" />
    <input onclick="calc()" type="button" value="Calculate" />
    <input onclick="ClearData('ALL')" type="button" value="Clear All" />
    <table>
      <tr>
      <tr>
        <td>
          Age
        </td>
        <td>
          <input id="AgeBox" type="text" />
        </td>
      </tr>        
      <tr>
        <td>
          Skill
        </td>
        <td>
          Percentage
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill1" type="text" />
        </td>
        <td>
          <input id="ChngPct1" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill2" type="text" />
        </td>
        <td>
          <input id="ChngPct2" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill3" type="text" />
        </td>
        <td>
          <input id="ChngPct3" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill4" type="text" />
        </td>
        <td>
          <input id="ChngPct4" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill5" type="text" />
        </td>
        <td>
          <input id="ChngPct5" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill6" type="text" />
        </td>
        <td>
          <input id="ChngPct6" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill7" type="text" />
        </td>
        <td>
          <input id="ChngPct7" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill8" type="text" />
        </td>
        <td>
          <input id="ChngPct8" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill9" type="text" />
        </td>
        <td>
          <input id="ChngPct9" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill10" type="text" />
        </td>
        <td>
          <input id="ChngPct10" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill11" type="text" />
        </td>
        <td>
          <input id="ChngPct11" type="text" />
        </td>
      </tr>
      <tr>
        <td>
          <input id="skill12" type="text" />
        </td>
        <td>
          <input id="ChngPct12" type="text" />
        </td>
      </tr>
    </tr></table>
    <br />
    <textarea cols="70" id="Status" rows="8">
    </textarea>
  </body>

</html>