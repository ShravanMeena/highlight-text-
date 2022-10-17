import { useState } from "react";
import Modal from "./Modal";
import Header from "./Header";
import "./App.css";

function Highlight({ children: text = "", tags = [] }) {
  if (!tags?.length) return text;

  let _tags = [];

  for (let index = 0; index < tags.length; index++) {
    const element = tags[index];

    _tags.push(element.key);
  }

  const matches = [...text.matchAll(new RegExp(_tags.join("|"), "ig"))];

  const startText = text.slice(0, matches[0]?.index);
  return (
    <span>
      {startText}
      {matches.map((match, i) => {
        const startIndex = match.index;
        const getType = tags.filter((tg) => tg.key == match)[0].category;
        const currentText = match[0];
        const endIndex = startIndex + currentText.length;
        const nextIndex = matches[i + 1]?.index;
        const untilNextText = text.slice(endIndex, nextIndex);
        return (
          <span key={i}>
            <mark>
              {currentText}{" "}
              <span
                style={{
                  color: "red",
                  marginRight: 3,
                  border: "1px solid red",
                }}
              >
                {getType}
              </span>
            </mark>
            {untilNextText}
          </span>
        );
      })}
    </span>
  );
}

// const tags = [];
function ParasList({ activeParaId, setPara }) {
  const paragraphHanlder = (para) => {
    setPara(para);
  };
  return (
    <ul>
      {paras.map((para, i) => (
        <li
          style={{
            cursor: "pointer",
            textAlign: "left",
            marginBottom: 10,
            padding: 10,
            backgroundColor: activeParaId === para.id && "#ccc",
          }}
          key={i}
          onClick={() => paragraphHanlder(para)}
        >
          {para.text?.slice(0, 35)}...
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  let defData = JSON.parse(localStorage.getItem("myItems"));
  const [selected, setSelected] = useState(defData ? defData : []);
  const [category, setCategory] = useState("person");
  const [isDelete, setIsDelete] = useState(false);

  const [para, setPara] = useState(paras[0]);

  function getSelectedText() {
    let txt = "";
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (window.document.getSelection) {
      txt = window.document.getSelection();
    } else if (window.document.selection) {
      txt = window.document.selection.createRange().text;
    }
    if (txt?.toString().length < 3) {
      // alert("min length 2 required");
      return;
    }

    if (txt?.toString().length > 20) {
      // alert("Max length 15 required");
      return;
    }

    let newArr = [...selected, { key: txt?.toString(), category }];

    localStorage.setItem("myItems", JSON.stringify(newArr));

    setSelected(newArr);
    return txt;
  }

  const [deletMedata, setdeletMedata] = useState("");

  function deleteMe() {
    let remain = selected?.filter((item) => item.key !== deletMedata);
    setSelected(remain);
    handleClose();
  }

  function deleteMeData(txt) {
    setdeletMedata(txt);
    setIsDelete(true);
  }

  function handleClose() {
    setIsDelete(false);
  }

  return (
    <>
      <Header />
      <div className="App">
        {isDelete && <Modal deleteMe={deleteMe} onClose={handleClose} />}

        <div className="divFirst">
          <div className="cardHeader">
            <h1>Records</h1>
          </div>
          <ParasList
            activeParaId={para?.id}
            // tags={selected}
            setPara={setPara}
          />
        </div>
        <div className="divTwo">
          <div className="cardHeader">
            <button
              onClick={() => setCategory("person")}
              type="button"
              style={{
                backgroundColor: category === "person" ? "green" : "red",

                color: "white",
              }}
            >
              Person
            </button>

            <button
              style={{
                backgroundColor: category === "org" ? "green" : "red",
                marginLeft: 10,
                color: "white",
              }}
              onClick={() => setCategory("org")}
              type="button"
            >
              Org
            </button>
          </div>

          <h4 onMouseUp={() => getSelectedText()}>
            <Highlight tags={selected}>{para?.text}</Highlight>
          </h4>
        </div>
        <div className="divThird">
          <div className="cardHeader">
            <h1>Annotations</h1>
          </div>
          <button
            onClick={() => {
              setSelected([]);
              localStorage.removeItem("myItems");
            }}
            type="button"
            className="ml-2  inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            CLEAR ALL
          </button>

          <h1>SELECTED LIST</h1>

          {selected.length === 0 &&
            "Select your words from the paragraph list..."}
          {selected?.map((item, index) => {
            return (
              <p key={index}>
                {item.key}
                <span
                  style={{
                    color: "red",
                    marginLeft: 5,
                    borderBottom: "1px solid red",
                  }}
                >
                  {item.category}
                </span>
                <span
                  onClick={() => deleteMeData(item.key)}
                  style={{ color: "red", marginLeft: 20 }}
                >
                  X
                </span>
              </p>
            );
          })}
        </div>

        {/* <ParasList /> */}
      </div>
    </>
  );
}

const paras = [
  {
    id: 1,
    text: "HStimulate your mind as you test your typing speed with this standard English paragraph typing test. Watch your typing speed and accuracy increase as you learn about a variety of new topics! Over 40 typing test selections available.",
  },
  {
    id: 2,
    text: "If you don't like a test prompt, you can get a different (random) prompt with the change test button - or select a specific paragraph to type from the list below. To find out how fast you type, just start typing in the blank textbox on the right of the test prompt. You will see your progress, including errors on the left side as you type. In order to complete the test and save your score, you need to get 100% accuracy. You can fix errors as you go, or correct them at the end with the help of the spell checker.",
  },
  {
    id: 3,
    text: "This feedback graph will follow you from page to page for your typing session. You can see more details by mousing over the graph. The session is reset when the tab on your browser is closed.",
  },
  {
    id: 4,
    text: "Medical transcription, also known as MT, is an allied health profession dealing with the process of transcribing voice-recorded medical reports that are dictated by physicians, nurses and other healthcare practitioners. Medical reports can be voice files, notes taken during a lecture, or other spoken material. These are dictated over the phone or uploaded digitally via the Internet or through smart phone apps.",
  },
];
