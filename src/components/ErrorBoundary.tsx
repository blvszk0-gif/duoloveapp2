import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-500/10 border-2 border-red-500/50 rounded-3xl text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Coś poszło nie tak</h2>
          <p className="text-gray-400 text-sm mb-4">
            {this.state.error?.message || "Wystąpił błąd podczas renderowania komponentu 3D."}
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold"
            onClick={() => this.setState({ hasError: false })}
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
