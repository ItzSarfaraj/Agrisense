import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";

const useChatbot = ({
  chatContext,
  initialMessages,
  selectedLanguage,
  stopSpeaking,
}) => {
  const [messages, setMessages] =
    useState(initialMessages);

  const [loading, setLoading] =
    useState(false);

  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const dispatchMessage = useCallback(
    async (message, historyOverride) => {
      if (!message || loading) return;

      const history = (
        historyOverride ?? messages
      ).map(({ role, content }) => ({
        role,
        content,
      }));

      const controller =
        new AbortController();

      abortRef.current = controller;
      setLoading(true);

      try {
        const response = await api.post(
          "/chat",
          {
            message,
            history,
            context: chatContext,
            language:
              selectedLanguage.label,
            languageCode:
              selectedLanguage.code,
          },
          {
            signal: controller.signal,
          },
        );

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              response.data.response ||
              "I couldn't generate a response right now.",
          },
        ]);
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          setMessages((previous) => [
            ...previous,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Stopped.",
            },
          ]);

          return;
        }

        console.error(
          "Chatbot error:",
          error.response?.data ||
            error.message,
        );

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Sorry, I couldn't process your question right now. Please try again.",
            error: true,
            retryMessage: message,
          },
        ]);
      } finally {
        setLoading(false);

        if (
          abortRef.current === controller
        ) {
          abortRef.current = null;
        }
      }
    },
    [
      chatContext,
      loading,
      messages,
      selectedLanguage,
    ],
  );

  const sendMessage = useCallback(
    async (input) => {
      const message = input.trim();

      if (
        !message ||
        loading
      ) {
        return false;
      }

      stopSpeaking();

      const currentMessages = messages;

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: message,
        },
      ]);

      await dispatchMessage(
        message,
        currentMessages,
      );

      return true;
    },
    [
      dispatchMessage,
      loading,
      messages,
      stopSpeaking,
    ],
  );

  const retryMessage = useCallback(
    async (message) => {
      if (!message || loading) {
        return;
      }

      stopSpeaking();

      setMessages((previous) =>
        previous.filter(
          (item) => !item.error,
        ),
      );

      await dispatchMessage(message);
    },
    [
      dispatchMessage,
      loading,
      stopSpeaking,
    ],
  );

  const regenerateLastResponse =
    useCallback(async () => {
      if (loading) return;

      stopSpeaking();

      const reversedIndex = [
        ...messages,
      ]
        .reverse()
        .findIndex(
          (message) =>
            message.role === "user",
        );

      if (reversedIndex === -1) {
        return;
      }

      const userIndex =
        messages.length -
        1 -
        reversedIndex;

      const lastUserMessage =
        messages[userIndex].content;

      const trimmedMessages =
        messages.slice(
          0,
          userIndex + 1,
        );

      setMessages(trimmedMessages);

      await dispatchMessage(
        lastUserMessage,
        trimmedMessages.slice(
          0,
          -1,
        ),
      );
    }, [
      dispatchMessage,
      loading,
      messages,
      stopSpeaking,
    ]);

  const stopGenerating = useCallback(() => {
    if (!loading) return;

    abortRef.current?.abort();
  }, [loading]);

  const clearChat = useCallback(
    (replacementMessages) => {
      stopSpeaking();

      if (loading) {
        abortRef.current?.abort();
      }

      setMessages(
        replacementMessages ??
          initialMessages,
      );
    },
    [
      initialMessages,
      loading,
      stopSpeaking,
    ],
  );

  return {
    messages,
    setMessages,
    loading,
    sendMessage,
    retryMessage,
    regenerateLastResponse,
    stopGenerating,
    clearChat,
  };
};

export default useChatbot;