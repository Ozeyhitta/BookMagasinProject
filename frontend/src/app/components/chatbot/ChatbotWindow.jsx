"use client";

import { useEffect, useRef, useState } from "react";
import "./chatbot.css";

const BOOKS_API = "http://localhost:8080/api/books";

const stripAccent = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatPrice = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Đang cập nhật";
  }
  return `${Number(value).toLocaleString("vi-VN")} đ`;
};

const parsePriceRange = (text) => {
  const normalized = stripAccent(text);
  const matches = [...normalized.matchAll(/(\d+(?:[.,]\d+)?)(\s*(k|ngan|nghin|trieu|m|mil|million)?)?/gi)];

  if (!matches.length) return {};

  const numbers = matches.map((m) => {
    const raw = m[1].replace(/[.,]/g, "");
    let val = parseFloat(raw);
    const unit = m[3] || "";
    if (/trieu|m|mil/.test(unit)) val *= 1_000_000;
    else if (/k|ngan|nghin/.test(unit)) val *= 1_000;
    else if (!unit && val < 3000) val *= 1_000; // assume "k" if value is small
    return val;
  });

  const firstNumber = numbers[0];
  let min = null;
  let max = null;

  if (/duoi|nho hon|it hon|<|<=|under|toi da/.test(normalized)) {
    max = firstNumber;
  } else if (/tren|lon hon|>|>=|from|tu|toi thieu/.test(normalized)) {
    min = firstNumber;
  } else if (numbers.length >= 2) {
    min = Math.min(numbers[0], numbers[1]);
    max = Math.max(numbers[0], numbers[1]);
  } else if (/khoang|tam|co|chung|quanh/.test(normalized)) {
    min = firstNumber * 0.85;
    max = firstNumber * 1.15;
  }

  return { min, max, target: firstNumber };
};

const matchesPrice = (price, range) => {
  if (!range.min && !range.max) return true;
  if (range.min && price < range.min) return false;
  if (range.max && price > range.max) return false;
  return true;
};

const describeRange = (range) => {
  if (range.min && range.max) return `${formatPrice(range.min)} - ${formatPrice(range.max)}`;
  if (range.min) return `từ ${formatPrice(range.min)}`;
  if (range.max) return `dưới ${formatPrice(range.max)}`;
  return "";
};

const selectSuggestions = (query, books) => {
  const normalizedQuery = stripAccent(query);
  const tokens = normalizedQuery
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !["gia", "sach", "gia ca"].includes(t));

  const datasetCategoryTokens = new Set(
    books
      .flatMap((b) => b.categories || [])
      .flatMap((c) => (c?.name ? stripAccent(c.name).split(/[^a-z0-9]+/) : []))
      .filter((t) => t.length > 2)
  );

  const queryCategoryTokens = tokens.filter((t) => datasetCategoryTokens.has(t));
  const hasCategoryIntent = queryCategoryTokens.length > 0;

  const priceRange = parsePriceRange(query);
  const hasPriceFilter = priceRange.min || priceRange.max;

  const scored = books.map((book) => {
    const title = stripAccent(book.title || "");
    const author = stripAccent(book.author || "");
    const categories = (book.categories || []).map((c) => stripAccent(c.name || ""));
    const categoryTokens = categories.flatMap((c) => c.split(/[^a-z0-9]+/).filter((t) => t.length > 1));

    const price = Number(book.sellingPrice) || 0;

    let score = 0;
    tokens.forEach((token) => {
      if (title.includes(token)) score += 3;
      if (author.includes(token)) score += 2;
      if (categoryTokens.some((c) => c === token)) score += 3;
      else if (categories.some((c) => c.includes(token))) score += 1;
    });

    if (matchesPrice(price, priceRange)) {
      score += 1;
    }

    const proximity = priceRange.target ? Math.abs(price - priceRange.target) : 0;

    return {
      book,
      score,
      proximity,
      priceOk: matchesPrice(price, priceRange),
      categoryHit: hasCategoryIntent ? categoryTokens.some((t) => queryCategoryTokens.includes(t)) : true,
    };
  });

  const filtered = scored
    .filter((item) => item.priceOk && item.categoryHit)
    .filter((item) => item.score > 0 || tokens.length === 0 || hasPriceFilter);

  const sorted = filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.proximity - b.proximity;
  });

  return {
    priceRange,
    suggestions: sorted.slice(0, 3).map((item) => ({
      title: item.book.title,
      author: item.book.author,
      sellingPrice: item.book.sellingPrice,
      categories: (item.book.categories || []).map((c) => c.name).filter(Boolean),
      id: item.book.id,
    })),
    hasTokens: tokens.length > 0,
    hasCategoryIntent,
  };
};

const getSmallTalkReply = (content) => {
  const normalized = stripAccent(content);
  const sadWords = ["buon", "met", "chan", "stress", "ap luc", "lo au"];
  const happyWords = ["vui", "tuyet", "hao hung", "tot qua"];
  const introWords = ["gioi thieu", "ban la ai", "ban ten gi"];

  if (sadWords.some((w) => normalized.includes(w))) {
    return "Nghe có vẻ bạn đang không vui. Bạn muốn kể thêm cho mình chuyện gì đang làm bạn buồn không? Mình có thể gợi ý vài cuốn sách giúp bạn thư giãn hoặc tạo động lực.";
  }
  if (happyWords.some((w) => normalized.includes(w))) {
    return "Thật tuyệt khi nghe bạn vui! Bạn muốn tìm sách để giữ năng lượng tích cực hay khám phá thêm chủ đề mới không?";
  }
  if (introWords.some((w) => normalized.includes(w))) {
    return "Mình là trợ lý BookMagasin. Mình có thể gợi ý sách theo thể loại, tác giả hoặc tầm giá. Bạn muốn hỏi gì nào?";
  }
  if (normalized.includes("tam su")) {
    return "Mình sẵn sàng lắng nghe. Bạn đang quan tâm điều gì? Nếu cần, mình có thể gợi ý vài cuốn sách giúp bạn cân bằng tinh thần.";
  }
  return null;
};

export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Mình là trợ lý của BookMagasin. Bạn cần hỗ trợ gì ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetch(BOOKS_API)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setBooks(Array.isArray(data) ? data : []);
        setLoadingBooks(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadingBooks(false);
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Hiện mình chưa lấy được dữ liệu sách. Bạn thử lại sau hoặc kiểm tra kết nối backend nhé.",
          },
        ]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;

    setMessages((prev) => [...prev, { from: "user", text: content }]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const smallTalk = getSmallTalkReply(content);
      let reply;
      if (smallTalk) {
        reply = { from: "bot", text: smallTalk };
      } else if (loadingBooks) {
        reply = { from: "bot", text: "Mình đang tải dữ liệu sách, bạn đợi một chút nhé." };
      } else if (!books.length) {
        reply = {
          from: "bot",
          text: "Chưa có dữ liệu sách để gợi ý lúc này. Bạn thử lại sau nhé.",
        };
      } else {
        const { suggestions, priceRange, hasTokens, hasCategoryIntent } = selectSuggestions(content, books);
        if (!suggestions.length) {
          const clarify = hasCategoryIntent
            ? "Mình chưa tìm thấy đúng thể loại bạn cần. Bạn cho biết cụ thể hơn hoặc thử tên sách/tác giả nhé?"
            : "Mình chưa tìm thấy sách phù hợp. Bạn cho mình biết thêm thể loại, tác giả hoặc tầm giá cụ thể hơn nhé?";
          reply = { from: "bot", text: clarify };
        } else {
          const rangeText = describeRange(priceRange);
          let intro = "Mình nghĩ bạn sẽ thích những lựa chọn sau:";
          if (rangeText) intro = `Mình lọc theo tầm giá ${rangeText}, bạn xem thử nhé:`;
          else if (hasTokens) intro = "Dựa trên nội dung bạn hỏi, mình gợi ý:";
          reply = {
            from: "bot",
            text: intro,
            suggestions,
          };
        }
      }

      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatHeader">
        <div className="chatHeaderLeft">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="Trợ lý BookMagasin" />
          <div className="chatHeaderText">
            <div className="chatHeading">Hỗ trợ trực tuyến</div>
          </div>
        </div>
        <button className="chatClose" onClick={onClose} aria-label="Đóng cửa sổ chat">
          ×
        </button>
      </div>

      <div className="chatBody">
        <div className="chatMessages" ref={messagesRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`messageRow ${msg.from === "user" ? "userRow" : "botRow"}`}>
              <div className="msgBubble">
                <div className="msgText">{msg.text}</div>
                {msg.suggestions && (
                  <div className="suggestionList">
                    {msg.suggestions.map((sug) => (
                      <div key={`${sug.id}-${sug.title}`} className="suggestionCard">
                        <div className="suggestionTitle">{sug.title}</div>
                        <div className="suggestionMeta">
                          <span className="suggestionPrice">{formatPrice(sug.sellingPrice)}</span>
                          {sug.author && <span className="suggestionAuthor"> - {sug.author}</span>}
                        </div>
                        {!!sug.categories?.length && (
                          <div className="suggestionCategories">{sug.categories.join(", ")}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="messageRow botRow">
              <div className="typingBubble">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <div className="chatInput">
          <textarea
            rows={2}
            placeholder="Bạn cần tư vấn sách gì?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="sendButton" onClick={handleSend}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
