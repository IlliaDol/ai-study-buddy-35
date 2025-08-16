import { formatDistanceToNow } from 'date-fns';
import { Trash2, BookOpen, Clock } from 'lucide-react';
import { SavedDeck } from '@/hooks/localStorage';
import { Card } from '@/components/ui/card';
import { useSRS } from '@/hooks/useSRS';

interface SavedDecksProps {
  decks: SavedDeck[];
  onReview: (deck: SavedDeck) => void;
  onDelete: (deckId: string) => void;
}

export default function SavedDecks({ decks, onReview, onDelete }: SavedDecksProps) {
  const { dueCards } = useSRS();

  if (decks.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Saved Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map((deck) => {
          const cardKeys = deck.flashcards.map((_, index) => `${deck.id}:${index}`);
          const dueDeckCards = dueCards(cardKeys);

          return (
            <Card key={deck.id} className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{deck.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Created {formatDistanceToNow(deck.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(deck.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete deck"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-600 mt-1 mb-3 flex-grow">
                <div>
                  <span>{deck.flashcards.length} flashcards</span>
                  <span className="mx-2">•</span>
                  <span>{deck.quizQuestions.length} quiz questions</span>
                </div>

                {dueDeckCards.length > 0 && (
                  <div className="mt-2 flex items-center text-amber-600">
                    <Clock size={16} className="mr-1" />
                    <span>{dueDeckCards.length} cards due for review</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onReview(deck)}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md px-4 py-2 transition-colors"
              >
                <BookOpen size={18} />
                Review Deck
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
