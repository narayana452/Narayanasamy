/* script.js */

"use strict";


/* =========================================================
   STATE
========================================================= */

let currentCategories = [];
let currentBits = 0;


/* =========================================================
   ELEMENTS
========================================================= */

const categoriesInput =
    document.getElementById("categories");

const datasetInput =
    document.getElementById("dataset");

const encodeBtn =
    document.getElementById("encodeBtn");

const clearBtn =
    document.getElementById("clearBtn");

const runTestsBtn =
    document.getElementById("runTestsBtn");

const categoryTableBody =
    document.querySelector("#categoryTable tbody");

const decoderTruthTableBody =
    document.querySelector("#decoderTruthTable tbody");

const resultTableBody =
    document.querySelector("#resultTable tbody");

const testTableBody =
    document.querySelector("#testTable tbody");

const binaryInputDisplay =
    document.getElementById("binaryInputDisplay");

const decoderOutputDisplay =
    document.getElementById("decoderOutputDisplay");

const resultStatus =
    document.getElementById("resultStatus");

const totalInputs =
    document.getElementById("totalInputs");

const validCases =
    document.getElementById("validCases");

const faultCases =
    document.getElementById("faultCases");

const accuracy =
    document.getElementById("accuracy");

const validationMessage =
    document.getElementById("validationMessage");


/* =========================================================
   REMOVE UNNECESSARY INTRO BUTTONS
========================================================= */

/*
   These three buttons are not required:

   1. Start Project
   2. View Software Solution
   3. Enter Interactive Software

   They are removed automatically from the existing HTML.
*/

document
    .querySelectorAll(
        "#startBtn, " +
        '[data-target="solutionSection"], ' +
        '[data-target="softwareSection"]'
    )
    .forEach(button => {

        button.remove();

    });


/*
   Problem Statement and Software Solution
   should be visible without button clicks.
*/

const solutionSection =
    document.getElementById("solutionSection");

if (solutionSection) {

    solutionSection.classList.add("show");

}


/*
   Interactive Software should also start directly
   without an "Enter Interactive Software" button.
*/

const softwareSection =
    document.getElementById("softwareSection");

if (softwareSection) {

    softwareSection.classList.add("show");

}


/* =========================================================
   SECTION REVEAL
========================================================= */

function showSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.add("show");

    setTimeout(() => {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);
}


/* =========================================================
   REMAINING REVEAL BUTTONS
========================================================= */

/*
   Only the actual learning-flow buttons remain active.

   Example:

   Next: Decoder Logic
   Next: One-Hot Encoding
   Next: Validation Report
   Next: Test Cases
   Next: Processing Flow
   Students Learning Platform
*/

document
    .querySelectorAll(".reveal-btn")
    .forEach(button => {

        const target =
            button.dataset.target;

        /*
           Ignore the three removed introductory buttons.
        */

        if (
            target === "solutionSection" ||
            target === "softwareSection"
        ) {
            return;
        }

        button.addEventListener("click", () => {

            showSection(target);

        });

    });


/* =========================================================
   PARSE VALUES
========================================================= */

function parseValues(text) {

    return text
        .split(/[\n,\s]+/)
        .map(value => value.trim())
        .filter(value => value.length > 0);
}


/* =========================================================
   UNIQUE CATEGORIES
========================================================= */

function uniqueValues(values) {

    const result = [];

    values.forEach(value => {

        const exists =
            result.some(
                item =>
                    item.toLowerCase() ===
                    value.toLowerCase()
            );

        if (!exists) {
            result.push(value);
        }

    });

    return result;
}


/* =========================================================
   REQUIRED BITS
========================================================= */

function calculateBits(numberOfCategories) {

    if (numberOfCategories <= 1) {
        return 1;
    }

    return Math.ceil(
        Math.log2(numberOfCategories)
    );
}


/* =========================================================
   BINARY
========================================================= */

function decimalToBinary(number, bits) {

    return number
        .toString(2)
        .padStart(bits, "0");
}


/* =========================================================
   DIGITAL DECODER
========================================================= */

function decoder(inputCode, numberOfOutputs) {

    const output =
        new Array(numberOfOutputs).fill(0);

    if (
        inputCode >= 0 &&
        inputCode < numberOfOutputs
    ) {
        output[inputCode] = 1;
    }

    return output;
}


/* =========================================================
   STANDARD ONE-HOT
========================================================= */

function standardOneHot(
    index,
    numberOfCategories
) {

    const output =
        new Array(numberOfCategories).fill(0);

    if (
        index >= 0 &&
        index < numberOfCategories
    ) {
        output[index] = 1;
    }

    return output;
}


/* =========================================================
   ARRAY COMPARISON
========================================================= */

function arraysEqual(a, b) {

    if (a.length !== b.length) {
        return false;
    }

    return a.every(
        (value, index) =>
            value === b[index]
    );
}


/* =========================================================
   CATEGORY MAP
========================================================= */

function createCategoryMap(categories) {

    const map = new Map();

    categories.forEach(
        (category, index) => {

            map.set(
                category.toLowerCase(),
                {
                    name: category,
                    code: index
                }
            );

        }
    );

    return map;
}


/* =========================================================
   CATEGORY TABLE
========================================================= */

function renderCategoryTable() {

    if (!categoryTableBody) {
        return;
    }

    categoryTableBody.innerHTML = "";

    currentCategories.forEach(
        (category, index) => {

            const binary =
                decimalToBinary(
                    index,
                    currentBits
                );

            const output =
                decoder(
                    index,
                    currentCategories.length
                );

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(category)}</td>
                <td>${index}</td>
                <td class="binary">${binary}</td>
                <td class="binary">${output.join("")}</td>
            `;

            categoryTableBody.appendChild(row);

        }
    );
}


/* =========================================================
   DECODER TRUTH TABLE
========================================================= */

function renderDecoderTruthTable() {

    if (!decoderTruthTableBody) {
        return;
    }

    decoderTruthTableBody.innerHTML = "";

    const totalDecoderInputs =
        Math.pow(2, currentBits);

    for (
        let input = 0;
        input < totalDecoderInputs;
        input++
    ) {

        const binary =
            decimalToBinary(
                input,
                currentBits
            );

        const output =
            decoder(
                input,
                currentCategories.length
            );

        const activeOutput =
            input < currentCategories.length
                ? `Y${input}`
                : "Unused / Invalid";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td class="binary">${binary}</td>
            <td>${input}</td>
            <td>${activeOutput}</td>
            <td class="binary">${output.join("")}</td>
        `;

        decoderTruthTableBody.appendChild(row);
    }
}


/* =========================================================
   RESULTS
========================================================= */

function renderResults(dataset) {

    if (!resultTableBody) {
        return;
    }

    resultTableBody.innerHTML = "";

    const map =
        createCategoryMap(
            currentCategories
        );

    let valid = 0;
    let faults = 0;


    dataset.forEach(
        (value, index) => {

            const info =
                map.get(
                    value.toLowerCase()
                );

            const row =
                document.createElement("tr");


            if (!info) {

                faults++;

                row.innerHTML = `
                    <td>${index + 1}</td>

                    <td>${escapeHTML(value)}</td>

                    <td class="invalid">
                        N/A
                    </td>

                    <td class="invalid">
                        INVALID
                    </td>

                    <td class="invalid">
                        INVALID
                    </td>

                    <td class="invalid">
                        FAULT
                    </td>
                `;

                resultTableBody.appendChild(row);

                return;
            }


            const decoderVector =
                decoder(
                    info.code,
                    currentCategories.length
                );


            const standardVector =
                standardOneHot(
                    info.code,
                    currentCategories.length
                );


            const matched =
                arraysEqual(
                    decoderVector,
                    standardVector
                );


            if (matched) {
                valid++;
            } else {
                faults++;
            }


            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    ${escapeHTML(info.name)}
                </td>

                <td class="binary">
                    ${decimalToBinary(
                        info.code,
                        currentBits
                    )}
                </td>

                <td class="binary">
                    ${decoderVector.join("")}
                </td>

                <td class="binary">
                    ${standardVector.join("")}
                </td>

                <td class="${
                    matched
                        ? "valid"
                        : "invalid"
                }">
                    ${
                        matched
                            ? "VALID"
                            : "MISMATCH"
                    }
                </td>
            `;


            resultTableBody.appendChild(row);

        }
    );


    const total =
        dataset.length;

    const percentage =
        total === 0
            ? 0
            : (valid / total) * 100;


    if (totalInputs) {
        totalInputs.textContent = total;
    }

    if (validCases) {
        validCases.textContent = valid;
    }

    if (faultCases) {
        faultCases.textContent = faults;
    }

    if (accuracy) {
        accuracy.textContent =
            `${percentage.toFixed(1)}%`;
    }


    if (faults === 0) {

        if (resultStatus) {
            resultStatus.textContent =
                "VALIDATED";
        }

        if (validationMessage) {

            validationMessage.className =
                "validation-box success";

            validationMessage.textContent =
                `All ${total} dataset input(s) matched ` +
                `the standard one-hot encoding.`;
        }

    } else {

        if (resultStatus) {
            resultStatus.textContent =
                "FAULT DETECTED";
        }

        if (validationMessage) {

            validationMessage.className =
                "validation-box error";

            validationMessage.textContent =
                `${faults} input(s) could not be validated. ` +
                `Check the category and dataset values.`;
        }
    }
}


/* =========================================================
   DECODER PREVIEW
========================================================= */

function updateDecoderPreview() {

    if (
        !binaryInputDisplay ||
        !decoderOutputDisplay
    ) {
        return;
    }


    if (currentCategories.length === 0) {

        binaryInputDisplay.textContent = "-";

        decoderOutputDisplay.textContent = "-";

        return;
    }


    const output =
        decoder(
            0,
            currentCategories.length
        );


    binaryInputDisplay.textContent =
        decimalToBinary(
            0,
            currentBits
        );

    decoderOutputDisplay.textContent =
        output.join("");
}


/* =========================================================
   GENERATE ENCODING
========================================================= */

function generateEncoding() {

    if (!categoriesInput || !datasetInput) {
        return;
    }


    const categories =
        uniqueValues(
            parseValues(
                categoriesInput.value
            )
        );


    const dataset =
        parseValues(
            datasetInput.value
        );


    if (categories.length === 0) {

        alert(
            "Please enter at least one category."
        );

        return;
    }


    if (categories.length > 16) {

        alert(
            "Maximum 16 categories are supported."
        );

        return;
    }


    if (dataset.length === 0) {

        alert(
            "Please enter at least one dataset value."
        );

        return;
    }


    currentCategories =
        categories;

    currentBits =
        calculateBits(
            categories.length
        );


    renderCategoryTable();

    renderDecoderTruthTable();

    renderResults(dataset);

    updateDecoderPreview();


    /*
       Generate Encoding reveals only
       the first actual interactive section.
    */

    showSection("categorySection");
}


/* =========================================================
   CLEAR
========================================================= */

function clearApplication() {

    if (categoriesInput) {
        categoriesInput.value = "";
    }

    if (datasetInput) {
        datasetInput.value = "";
    }


    if (categoryTableBody) {
        categoryTableBody.innerHTML = "";
    }

    if (decoderTruthTableBody) {
        decoderTruthTableBody.innerHTML = "";
    }

    if (resultTableBody) {
        resultTableBody.innerHTML = "";
    }


    if (binaryInputDisplay) {
        binaryInputDisplay.textContent = "-";
    }

    if (decoderOutputDisplay) {
        decoderOutputDisplay.textContent = "-";
    }


    if (totalInputs) {
        totalInputs.textContent = "0";
    }

    if (validCases) {
        validCases.textContent = "0";
    }

    if (faultCases) {
        faultCases.textContent = "0";
    }

    if (accuracy) {
        accuracy.textContent = "0%";
    }


    if (resultStatus) {
        resultStatus.textContent = "WAITING";
    }


    if (validationMessage) {

        validationMessage.className =
            "validation-box";

        validationMessage.textContent =
            "Enter categories and dataset values to begin validation.";
    }


    currentCategories = [];

    currentBits = 0;
}


/* =========================================================
   TEST CASES
========================================================= */

const normalTests = [

    {
        name: "N01",
        type: "Normal",
        input: "Red",
        expected: "1000"
    },

    {
        name: "N02",
        type: "Normal",
        input: "Green",
        expected: "0100"
    },

    {
        name: "N03",
        type: "Normal",
        input: "Blue",
        expected: "0010"
    },

    {
        name: "N04",
        type: "Normal",
        input: "Yellow",
        expected: "0001"
    },

    {
        name: "N05",
        type: "Normal",
        input: "Red, Blue",
        expected: "1000 | 0010"
    },

    {
        name: "N06",
        type: "Normal",
        input: "Green, Yellow",
        expected: "0100 | 0001"
    },

    {
        name: "N07",
        type: "Normal",
        input: "Red, Red",
        expected: "1000 | 1000"
    },

    {
        name: "N08",
        type: "Normal",
        input: "Blue, Green, Red",
        expected: "0010 | 0100 | 1000"
    },

    {
        name: "N09",
        type: "Normal",
        input: "Yellow, Blue, Red",
        expected: "0001 | 0010 | 1000"
    },

    {
        name: "N10",
        type: "Normal",
        input: "Red, Green, Blue, Yellow",
        expected: "1000 | 0100 | 0010 | 0001"
    }

];


const faultTests = [

    {
        name: "F01",
        type: "Edge/Fault",
        input: "Purple",
        expected: "INVALID"
    },

    {
        name: "F02",
        type: "Edge/Fault",
        input: "",
        expected: "INVALID"
    },

    {
        name: "F03",
        type: "Edge/Fault",
        input: "red",
        expected: "1000"
    },

    {
        name: "F04",
        type: "Edge/Fault",
        input: "Green, Unknown",
        expected: "0100 | INVALID"
    },

    {
        name: "F05",
        type: "Edge/Fault",
        input: "  Blue  ",
        expected: "0010"
    }

];


/* =========================================================
   TEST EVALUATION
========================================================= */

function evaluateTest(
    input,
    expected
) {

    const categories = [
        "Red",
        "Green",
        "Blue",
        "Yellow"
    ];

    const values =
        parseValues(input);


    if (values.length === 0) {

        return expected === "INVALID";
    }


    const map =
        createCategoryMap(categories);

    const generated = [];


    values.forEach(value => {

        const info =
            map.get(
                value.toLowerCase()
            );


        if (!info) {

            generated.push("INVALID");

        } else {

            generated.push(
                decoder(
                    info.code,
                    categories.length
                ).join("")
            );
        }

    });


    return generated.join(" | ") === expected;
}


/* =========================================================
   RUN TEST CASES
========================================================= */

function runTestCases() {

    if (!testTableBody) {
        return;
    }

    testTableBody.innerHTML = "";

    const allTests = [
        ...normalTests,
        ...faultTests
    ];

    let passed = 0;


    allTests.forEach(test => {

        const result =
            evaluateTest(
                test.input,
                test.expected
            );


        if (result) {
            passed++;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${test.name}</td>

            <td>${test.type}</td>

            <td>
                ${escapeHTML(
                    test.input || "(empty)"
                )}
            </td>

            <td class="binary">
                ${escapeHTML(test.expected)}
            </td>

            <td class="${
                result
                    ? "valid"
                    : "invalid"
            }">
                ${
                    result
                        ? "PASS"
                        : "FAIL"
                }
            </td>
        `;


        testTableBody.appendChild(row);

    });


    const summary =
        document.createElement("tr");


    summary.innerHTML = `
        <td colspan="4">
            Total Tests Passed
        </td>

        <td class="${
            passed === allTests.length
                ? "valid"
                : "invalid"
        }">
            ${passed} / ${allTests.length}
        </td>
    `;


    testTableBody.appendChild(summary);
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   EVENTS
========================================================= */

if (encodeBtn) {

    encodeBtn.addEventListener(
        "click",
        generateEncoding
    );

}


if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        clearApplication
    );

}


if (runTestsBtn) {

    runTestsBtn.addEventListener(
        "click",
        runTestCases
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

/*
   Do not automatically reveal the later sections.

   Visible initially:
   - Problem Statement
   - Software Solution
   - Interactive Software / Dataset Input

   Hidden initially:
   - Category Codes
   - Decoder Logic
   - One-Hot Encoding
   - Validation
   - Test Cases
   - Processing Flow
   - Students Learning Platform

   These will appear one-by-one using their
   respective Next buttons.
========================================================= */