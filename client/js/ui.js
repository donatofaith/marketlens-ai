function formatPrice(price) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",

      minimumFractionDigits:
        price < 1 ? 4 : 2,

      maximumFractionDigits:
        price < 1 ? 6 : 2
    }
  ).format(price);
}


function updateMarketCard(
  market
) {

  const card =
    document.querySelector(
      `[data-symbol="${market.symbol}"]`
    );

  if (!card) {
    return;
  }

  const priceElement =
    card.querySelector(
      ".market-price"
    );

  const changeElement =
    card.querySelector(
      ".market-change"
    );

  priceElement.textContent =
    formatPrice(
      market.price
    );


  const change =
    market.changePercent;

  const sign =
    change > 0
      ? "+"
      : "";

  changeElement.textContent =
    `${sign}${change.toFixed(2)}%`;


  changeElement.classList.remove(
    "positive",
    "negative"
  );


  if (change >= 0) {

    changeElement.classList.add(
      "positive"
    );

  } else {

    changeElement.classList.add(
      "negative"
    );

  }

}


function showMarketError() {

  const cards =
    document.querySelectorAll(
      ".market-card"
    );

  cards.forEach((card) => {

    const price =
      card.querySelector(
        ".market-price"
      );

    const change =
      card.querySelector(
        ".market-change"
      );

    price.textContent =
      "Unavailable";

    change.textContent =
      "Try again later";

  });

}
const workflowIds = [
  "workflowUnderstand",
  "workflowRetrieve",
  "workflowAnalyze",
  "workflowGenerate"
];


function resetWorkflow() {

  workflowIds.forEach(
    (id) => {

      const step =
        document.getElementById(id);

      if (!step) return;

      step.classList.remove(
        "active",
        "complete"
      );

      const icon =
        step.querySelector(
          ".step-icon"
        );

      if (icon) {
        icon.textContent =
          workflowIds.indexOf(id) + 1;
      }

    }
  );

}


function setWorkflowStep(
  index,
  state = "active"
) {

  const step =
    document.getElementById(
      workflowIds[index]
    );

  if (!step) return;


  step.classList.remove(
    "active",
    "complete"
  );

  step.classList.add(state);


  if (state === "complete") {

    const icon =
      step.querySelector(
        ".step-icon"
      );

    if (icon) {
      icon.textContent = "✓";
    }

  }

}


function setAgentStatus(text) {

  const badge =
    document.getElementById(
      "agentStatusBadge"
    );

  if (badge) {
    badge.textContent = text;
  }

}


function delay(ms) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  );

}


function formatReportNumber(
  number
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 2
    }
  ).format(number);

}


function formatReportPrice(
  number
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",

      maximumFractionDigits:
        number < 1 ? 6 : 2
    }
  ).format(number);

}


function renderReport(report) {

  const container =
    document.getElementById(
      "reportContent"
    );

  if (!container) return;


  const marketRows =
    report.markets
      .map(
        (market) => {

          const asset =
            market.symbol.replace(
              "USDT",
              ""
            );

          const changeClass =
            market.changePercent >= 0
              ? "positive"
              : "negative";

          const sign =
            market.changePercent > 0
              ? "+"
              : "";

          return `
            <div class="report-market-row">

              <div>
                <strong>
                  ${asset}
                </strong>

                <span>
                  ${formatReportPrice(
                    market.price
                  )}
                </span>
              </div>

              <span class="${changeClass}">
                ${sign}${market.changePercent.toFixed(2)}%
              </span>

            </div>
          `;

        }
      )
      .join("");


  const insights =
    report.insights
      .map(
        (insight) =>
          `<li>${insight}</li>`
      )
      .join("");


  const risks =
    report.risks
      .map(
        (risk) =>
          `<li>${risk}</li>`
      )
      .join("");


  const generated =
    new Date(
      report.generatedAt
    ).toLocaleString();


  container.className =
    "report-results";


  container.innerHTML = `
    <div class="report-header">

      <div class="report-ai-icon">
        ✦
      </div>

      <div>
        <span class="report-label">
          MARKETLENS INTELLIGENCE
        </span>

        <h4>
          ${report.title}
        </h4>
      </div>

    </div>


    <p class="report-summary">
      ${report.summary}
    </p>


    <div class="report-market-list">
      ${marketRows}
    </div>


    <div class="report-section">

      <h5>
        Key Observations
      </h5>

      <ul>
        ${insights}
      </ul>

    </div>


    <div class="report-section risk-section">

      <h5>
        Risks & Limitations
      </h5>

      <ul>
        ${risks}
      </ul>

    </div>


    <div class="report-meta">

      <span>
        Source: Binance Market Data
      </span>

      <span>
        ${generated}
      </span>

    </div>
  `;

}


function showAgentError(
  message
) {

  const container =
    document.getElementById(
      "reportContent"
    );

  if (!container) return;


  container.className =
    "empty-report";


  container.innerHTML = `
    <div class="report-symbol">
      !
    </div>

    <h4>
      Analysis unavailable
    </h4>

    <p>
      ${message}
    </p>
  `;

}