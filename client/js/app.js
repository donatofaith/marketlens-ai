const agentForm =
  document.getElementById(
    "agentForm"
  );

const agentInput =
  document.getElementById(
    "agentInput"
  );

const promptChips =
  document.querySelectorAll(
    ".prompt-chip"
  );


/* =================================
   PROMPT CHIPS
================================= */

promptChips.forEach(
  (chip) => {

    chip.addEventListener(
      "click",
      () => {

        agentInput.value =
          chip.textContent.trim();

        agentInput.focus();

        agentForm.requestSubmit();

      }
    );

  }
);


/* =================================
   AGENT FORM
================================= */

agentForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const query =
      agentInput.value.trim();


    if (!query) {

      agentInput.focus();

      return;

    }


    const analyzeButton =
      agentForm.querySelector(
        "button[type='submit']"
      );


    analyzeButton.disabled =
      true;

    analyzeButton.textContent =
      "Analyzing...";


    resetWorkflow();

    setAgentStatus(
      "Working"
    );


    try {

      /* STEP 1 */

      setWorkflowStep(
        0,
        "active"
      );

      await delay(450);

      setWorkflowStep(
        0,
        "complete"
      );


      /* STEP 2 */

      setWorkflowStep(
        1,
        "active"
      );


      const reportPromise =
        runMarketAgent(
          query
        );


      await delay(650);

      setWorkflowStep(
        1,
        "complete"
      );


      /* STEP 3 */

      setWorkflowStep(
        2,
        "active"
      );

      await delay(550);

      setWorkflowStep(
        2,
        "complete"
      );


      /* STEP 4 */

      setWorkflowStep(
        3,
        "active"
      );


      const report =
        await reportPromise;


      await delay(400);


      renderReport(
        report
      );


      setWorkflowStep(
        3,
        "complete"
      );


      setAgentStatus(
        "Complete"
      );


    } catch (error) {

      console.error(
        "Agent error:",
        error
      );


      showAgentError(
        error.message
      );


      setAgentStatus(
        "Error"
      );


    } finally {

      analyzeButton.disabled =
        false;

      analyzeButton.textContent =
        "Analyze";

    }

  }
);


/* =================================
   MARKET DATA
================================= */

async function loadMarkets() {

  try {

    const markets =
      await fetchMarkets();


    markets.forEach(
      (market) => {

        updateMarketCard(
          market
        );

      }
    );


  } catch (error) {

    console.error(
      "Market data error:",
      error
    );


    showMarketError();

  }

}


/* =================================
   INITIAL LOAD
================================= */

loadMarkets();


/* =================================
   AUTO REFRESH
================================= */

setInterval(
  loadMarkets,
  60000
);