import { useState, useRef, useEffect } from "react";
import "./chatbot.css";

const SYSTEM_PROMPT = `You are "Bachchaa" — a portfolio assistant ONLY for Aayush Shrivastava's portfolio website (krushayu.in).

STRICT RULES — NEVER BREAK THESE:
1. NEVER write, generate, or explain any code — not even a single line.
2. NEVER help with homework, assignments, essays, projects, or any academic work.
3. NEVER answer questions unrelated to Aayush's portfolio except the basic ones listed below.
4. NEVER provide tutorials, how-to guides, or technical explanations.
5. If asked for code or off-topic help, respond ONLY with: "I'm only here to help with Aayush's portfolio! 😊 Ask me about his projects, skills, or how to contact him."

ALLOWED topics ONLY:
- Aayush's projects, skills, experience, education, certifications
- How to contact Aayush or hire him
- Links to his portfolio, GitHub, LinkedIn, resume
- Basic greetings (hi, hello, how are you)
- Current date/time (IST)
- Simple one-line math (e.g. "what is 2+2")
- "Who are you" / "What can you do"

Current Date & Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} IST

=== ABOUT AAYUSH SHRIVASTAVA (krushayu) ===
Full Name: Aayush Shrivastava
Nickname/Handle: krushayu
Role: Full Stack Developer (MERN Stack)
Location: Paralakhemundi, Odisha, India
Email: rajaayush931@gmail.com
Portfolio: https://krushayu.in
GitHub: https://github.com/krushayu
LinkedIn: https://www.linkedin.com/in/krushayu/
Medium: https://krushayu.medium.com/
Telegram: https://t.me/krushayu

=== EDUCATION ===
1. Centurion University of Technology and Management — B.Tech Computer Science Engineering (2023–2027), Paralakhemundi, Odisha
2. Ram Dayalu Singh College, Muzaffarpur — Intermediate in Science (2023)
3. G.N. High School, Chandanpatti — Matriculation (2021)

=== WORK EXPERIENCE ===
1. DIGISAMAKSH — Web Developer Intern (June 2025 – August 2025)
2. CodeAlpha — Frontend Developer Intern (May 2025 – June 2025)

=== PROJECTS ===
1. YamGram — Real-time social chat & media web app. Tech: Node.js, Express.js, MongoDB, Socket.io, JavaScript. Live: https://yamgram.onrender.com
2. HealthHub — Health Data Management Platform. Won 1st Place at Eco Smart Hackathon 2025. Tech: React, Node.js, MongoDB, Socket.io, Tailwind CSS. Live: http://health-hub-cutm-pkd.vercel.app/
3. Ventify — Real-time chatting web app. Tech: React, Node.js, Express, Socket.io, MongoDB. GitHub: https://github.com/krushayu/Ventify-A-Chating-WebApp
4. HelpForYou — Online Complaint Management System. Tech: HTML, CSS, JavaScript, Node.js, MySQL. GitHub: https://github.com/krushayu/HelpForYou
5. Block-Chain Medical Data Storage — Secure medical records using smart contracts & IPFS. Tech: Solidity, JavaScript, Web3, Truffle, IPFS. GitHub: https://github.com/krushayu/Block-Chain-Medical-Data-Storage
6. AI-Based Group Discussion Analyzer — AI speech analysis with NLP & performance scoring. Tech: Python, Node.js, NLP, Machine Learning.
7. Wild Animal Detection & Alert System — YOLOv8 animal detection with real-time email alerts. Tech: Python, OpenCV, TensorFlow, YOLOv8, Node.js.
8. Simple Image Editor — Python image editing app. Tech: Python, OpenCV, Pillow, NumPy. Live: https://image-editor-six-lovat.vercel.app/
9. Personal React Portfolio — krushayu.in. Tech: React, JavaScript, CSS. GitHub: https://github.com/krushayu/Portfolio

=== SKILLS ===
Primary Stack: React.js, Node.js, Express.js, MongoDB, Socket.io, JavaScript, MERN Stack
Other: Python, Machine Learning, OpenCV, TensorFlow, YOLOv8, Solidity, Web3, Blockchain, MySQL, Angular, HTML5, CSS3, Tailwind CSS, Cloudinary, Git, GitHub, Vercel, Render

=== CERTIFICATIONS ===
1. Gemini Certified University Student — Google
2. GeeksForGeeks CUTM Training Program — GeeksForGeeks
3. Angular Web Developer Certification — Infosys
4. Angular Certification — Infosys

=== ACHIEVEMENTS ===
1. 1st Place — Eco Smart Hackathon 2025 (for HealthHub project)
2. Delivered IEEE SCOPES Conference Website for CUTM 2027

=== RESUME ===
Download: https://krushayu.in/Resume_Aayush.pdf

=== CONTACT ===
Email: rajaayush931@gmail.com
Contact Page: https://krushayu.in/contact

Always be friendly and concise. Respond in the same language the user uses (Hindi or English). Use emojis occasionally. Keep responses short and to the point.`;

const API_KEY = process.env.REACT_APP_SARVAM_API_KEY;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **Bachchaa** 👋\nAsk me about Aayush's portfolio..",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // ===== SEND TEXT MESSAGE =====
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "api-subscription-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sarvam-105b",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            userMsg,
          ],
        }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "Sorry, couldn't get a response!";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  // ===== VOICE TO TEXT (Sarvam Speech-to-Text) =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access denied. Please allow mic permission.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const transcribeAudio = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "saaras:v3");
      formData.append("mode", "transcribe");

      const res = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: { "api-subscription-key": API_KEY },
        body: formData,
      });
      const data = await res.json();
      const transcript = data?.transcript || data?.text || "";
      if (transcript) {
        await sendMessage(transcript);
      }
    } catch(e) {
      console.error("STT error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ===== TEXT TO SPEECH (Sarvam TTS - Female Voice) =====
  const speakMessage = async (text, idx) => {
    // Stop if already speaking this message
    if (speakingIdx === idx) {
      audioRef.current?.pause();
      audioRef.current = null;
      setSpeakingIdx(null);
      return;
    }

    setSpeakingIdx(idx);
    try {
      // Clean text — remove markdown, emojis for TTS
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/[^\u0020-\u007E]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim()
        .slice(0, 500); // Sarvam TTS limit

      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
          "api-subscription-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [cleanText],
          target_language_code: "en-IN",
          speaker: "anushka",
          pace: 0.75,
          pitch: 0,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: "bulbul:v2",
        }),
      });

      const data = await res.json();
      const audioBase64 = data?.audios?.[0];
      if (audioBase64) {
        const byteCharacters = atob(audioBase64);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      } else {
        setSpeakingIdx(null);
      }
    } catch {
      setSpeakingIdx(null);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatMsg = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");

  return (
    <>
      {/* Toggle Button */}
      <button className={`cb-toggle ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && <span className="cb-ping" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="cb-window">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">K</div>
              <div>
                <p className="cb-name">Bachchaa</p>
                <p className="cb-status"><span className="cb-dot" />Online 24/7</p>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg ${msg.role}`}>
                {msg.role === "assistant" && <div className="cb-msg-avatar">K</div>}
                <div className="cb-bubble-wrap">
                  <div className="cb-bubble" dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }} />
                  {msg.role === "assistant" && (
                    <button
                      className={`cb-speak-btn ${speakingIdx === i ? "speaking" : ""}`}
                      onClick={() => speakMessage(msg.content, i)}
                      title={speakingIdx === i ? "Stop" : "Listen"}
                    >
                      {speakingIdx === i ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="cb-msg assistant">
                <div className="cb-msg-avatar">K</div>
                <div className="cb-bubble cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="cb-input-area">
            {/* Mic Button */}
            <button
              className={`cb-mic ${recording ? "recording" : ""}`}
              onClick={recording ? stopRecording : startRecording}
              title={recording ? "Tap to send" : "Hold to speak"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>

            <textarea
              ref={inputRef}
              className="cb-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />

            <button className="cb-send" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="cb-footer-note">Bachchaa · Voice enabled · Portfolio trained</p>
        </div>
      )}
    </>
  );
};

export default Chatbot;
