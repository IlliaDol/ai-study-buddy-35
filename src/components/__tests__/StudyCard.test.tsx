import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { StudyCard } from '../StudyCard'

const mockCards = [
  { front: 'What is React?', back: 'A JavaScript library for building user interfaces' },
  { front: 'What is TypeScript?', back: 'A superset of JavaScript that adds static typing' }
]

const mockProps = {
  cards: mockCards,
  currentIndex: 0,
  setCurrentIndex: vi.fn(),
  onBack: vi.fn(),
  topic: 'React Basics',
  onReview: vi.fn(),
}

describe('StudyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first card question', () => {
    render(<StudyCard {...mockProps} />)
    expect(screen.getByText('What is React?')).toBeInTheDocument()
  })

  it('shows card progress', () => {
    render(<StudyCard {...mockProps} />)
    expect(screen.getByText('flashcards.card')).toBeInTheDocument()
  })

  it('flips card when clicked', () => {
    render(<StudyCard {...mockProps} />)
    
    const cardButton = screen.getByRole('button', { name: /show answer/i })
    fireEvent.click(cardButton)
    
    expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(<StudyCard {...mockProps} />)
    
    expect(screen.getByText('flashcards.previous')).toBeInTheDocument()
    expect(screen.getByText('flashcards.next')).toBeInTheDocument()
  })

  it('disables previous button on first card', () => {
    render(<StudyCard {...mockProps} />)
    
    const prevButton = screen.getByText('flashcards.previous')
    expect(prevButton).toBeDisabled()
  })

  it('calls onBack when back button is clicked', () => {
    render(<StudyCard {...mockProps} />)
    
    // Find the back button by its icon (ArrowLeft)
    const backButton = screen.getByRole('button').closest('button')
    fireEvent.click(backButton!)
    
    expect(mockProps.onBack).toHaveBeenCalled()
  })

  it('shows review buttons when card is flipped', () => {
    render(<StudyCard {...mockProps} />)
    
    const cardButton = screen.getByRole('button', { name: /show answer/i })
    fireEvent.click(cardButton)
    
    expect(screen.getByText('flashcards.again')).toBeInTheDocument()
    expect(screen.getByText('flashcards.hard')).toBeInTheDocument()
    expect(screen.getByText('flashcards.good')).toBeInTheDocument()
    expect(screen.getByText('flashcards.easy')).toBeInTheDocument()
  })
})
