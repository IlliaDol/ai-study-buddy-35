import { Intent, ReadingResult } from '@/types'

const READING_DATA = {
  love: [
    { symbol: 'Heart', message: 'Today your heart is open to new connections. Don\'t be afraid to show your true essence.', ritual: 'Write down 3 things you are grateful for today', color: 'pink' },
    { symbol: 'Rose', message: 'Love is blooming around you. Open your eyes to the beauty of relationships.', ritual: 'Send a kind message to someone you care about', color: 'pink' },
    { symbol: 'Dove', message: 'Peace and harmony will find you in matters of the heart.', ritual: 'Practice self-love with a warm bath or meditation', color: 'pink' },
    { symbol: 'Cupid', message: 'Romantic surprises await you. Keep your heart open to unexpected encounters.', ritual: 'Wear something that makes you feel confident', color: 'pink' },
    { symbol: 'Butterfly', message: 'Your love life is transforming beautifully. Embrace the changes.', ritual: 'Release old emotional baggage through writing', color: 'pink' },
    { symbol: 'Moon', message: 'Intuition guides your heart today. Trust your feelings.', ritual: 'Light a candle and meditate on love', color: 'pink' },
    { symbol: 'Sun', message: 'Your inner light attracts love and admiration.', ritual: 'Spend time in nature to recharge your heart', color: 'pink' },
    { symbol: 'Star', message: 'Your soulmate is closer than you think. Keep believing.', ritual: 'Create a vision board of your ideal relationship', color: 'pink' },
    { symbol: 'Flower', message: 'Love grows in unexpected places. Be patient and nurturing.', ritual: 'Plant something and watch it grow with your love', color: 'pink' },
    { symbol: 'Angel', message: 'Divine love surrounds you. You are never alone.', ritual: 'Practice gratitude for all the love in your life', color: 'pink' }
  ],
  money: [
    { symbol: 'Key', message: 'Financial opportunities are waiting around the corner. Pay attention to details.', ritual: 'Place a coin in your wallet and carry it all day', color: 'green' },
    { symbol: 'Tree', message: 'Your wealth is growing steadily. Invest in long-term success.', ritual: 'Save a small amount of money today', color: 'green' },
    { symbol: 'Dragon', message: 'Abundance flows to you. Your financial power is increasing.', ritual: 'Visualize your financial goals clearly', color: 'green' },
    { symbol: 'Coin', message: 'Money attracts money. Focus on prosperity mindset.', ritual: 'Count your blessings and abundance', color: 'green' },
    { symbol: 'Ladder', message: 'You are climbing the ladder of success. Keep moving upward.', ritual: 'Take one step toward your financial goal', color: 'green' },
    { symbol: 'Fountain', message: 'Wealth flows abundantly. You are a magnet for prosperity.', ritual: 'Give generously to attract more abundance', color: 'green' },
    { symbol: 'Crown', message: 'You are destined for financial greatness. Claim your power.', ritual: 'Dress as if you already have wealth', color: 'green' },
    { symbol: 'Bridge', message: 'New financial connections are forming. Network wisely.', ritual: 'Reach out to someone who can help your career', color: 'green' },
    { symbol: 'Mountain', message: 'Your financial goals are within reach. Keep climbing.', ritual: 'Review and update your financial plan', color: 'green' },
    { symbol: 'River', message: 'Money flows continuously to you. Stay in the flow.', ritual: 'Practice abundance affirmations daily', color: 'green' }
  ],
  education: [
    { symbol: 'Book', message: 'Your wisdom grows with each day. Today is favorable for learning.', ritual: 'Read 10 pages of something new', color: 'blue' },
    { symbol: 'Lightbulb', message: 'Brilliant ideas are coming to you. Write them down.', ritual: 'Start a new course or skill today', color: 'blue' },
    { symbol: 'Compass', message: 'Your path to knowledge is clear. Follow your curiosity.', ritual: 'Explore a topic you know nothing about', color: 'blue' },
    { symbol: 'Telescope', message: 'You can see far into the future. Plan your learning journey.', ritual: 'Set a long-term educational goal', color: 'blue' },
    { symbol: 'Microscope', message: 'Pay attention to details. Small things matter in learning.', ritual: 'Practice focused study for 30 minutes', color: 'blue' },
    { symbol: 'Globe', message: 'Your knowledge spans the world. Share your wisdom.', ritual: 'Teach someone something new today', color: 'blue' },
    { symbol: 'Pencil', message: 'Your thoughts are powerful. Write down your insights.', ritual: 'Start a learning journal', color: 'blue' },
    { symbol: 'Graduation Cap', message: 'You are ready for the next level. Take that step.', ritual: 'Apply for a new opportunity', color: 'blue' },
    { symbol: 'Brain', message: 'Your mental capacity is expanding. Trust your intelligence.', ritual: 'Solve a challenging puzzle or problem', color: 'blue' },
    { symbol: 'Library', message: 'Knowledge is your sanctuary. Immerse yourself in learning.', ritual: 'Visit a library or bookstore', color: 'blue' }
  ],
  luck: [
    { symbol: 'Star', message: 'Luck is on your side today! Trust your intuition.', ritual: 'Do something you always wanted but were afraid of', color: 'yellow' },
    { symbol: 'Clover', message: 'Good fortune surrounds you. Stay positive and open.', ritual: 'Wear something green for extra luck', color: 'yellow' },
    { symbol: 'Rainbow', message: 'Magic is in the air. Expect wonderful surprises.', ritual: 'Make a wish when you see something special', color: 'yellow' },
    { symbol: 'Horseshoe', message: 'Protection and luck are with you. Ride the wave.', ritual: 'Hang something lucky in your home', color: 'yellow' },
    { symbol: 'Dice', message: 'Take calculated risks today. Fortune favors the bold.', ritual: 'Try something new and unexpected', color: 'yellow' },
    { symbol: 'Wishbone', message: 'Your wishes are coming true. Believe in miracles.', ritual: 'Make a wish and keep it secret', color: 'yellow' },
    { symbol: 'Lucky Cat', message: 'Good luck is attracted to you. Stay optimistic.', ritual: 'Help someone else to increase your luck', color: 'yellow' },
    { symbol: 'Four-Leaf Clover', message: 'Rare luck is yours today. Seize the moment.', ritual: 'Look for lucky signs in nature', color: 'yellow' },
    { symbol: 'Golden Key', message: 'Opportunities are unlocking for you. Be ready.', ritual: 'Open a door you\'ve never opened before', color: 'yellow' },
    { symbol: 'Lucky Penny', message: 'Small blessings lead to big luck. Appreciate everything.', ritual: 'Find a penny and make a wish', color: 'yellow' }
  ],
  health: [
    { symbol: 'Tree', message: 'Your health is strong and growing. Nurture your body.', ritual: 'Spend 20 minutes in nature today', color: 'green' },
    { symbol: 'Water', message: 'Hydration is key to your vitality. Drink more water.', ritual: 'Start your day with a glass of water', color: 'green' },
    { symbol: 'Sun', message: 'Your energy is bright and powerful. Embrace the light.', ritual: 'Get 15 minutes of sunlight', color: 'green' },
    { symbol: 'Heart', message: 'Your cardiovascular health is excellent. Keep moving.', ritual: 'Do 30 minutes of cardio exercise', color: 'green' },
    { symbol: 'Leaf', message: 'Fresh air and nature heal you. Breathe deeply.', ritual: 'Take deep breaths for 5 minutes', color: 'green' },
    { symbol: 'Mountain', message: 'Your strength and endurance are building. Keep climbing.', ritual: 'Challenge yourself physically today', color: 'green' },
    { symbol: 'Wave', message: 'Your energy flows naturally. Go with the flow.', ritual: 'Practice gentle stretching or yoga', color: 'green' },
    { symbol: 'Fire', message: 'Your metabolism is strong. Fuel your body well.', ritual: 'Eat a nutritious meal mindfully', color: 'green' },
    { symbol: 'Crystal', message: 'Your aura is clear and healthy. Protect your energy.', ritual: 'Meditate to cleanse your energy field', color: 'green' },
    { symbol: 'Dove', message: 'Peace and calm improve your health. Reduce stress.', ritual: 'Take a 10-minute break to relax', color: 'green' }
  ],
  travel: [
    { symbol: 'Compass', message: 'Your journey is guided by intuition. Trust your direction.', ritual: 'Plan your next adventure today', color: 'cyan' },
    { symbol: 'Map', message: 'New paths are opening for you. Explore boldly.', ritual: 'Visit a place you\'ve never been', color: 'cyan' },
    { symbol: 'Airplane', message: 'Your wings are ready to fly. Take that trip.', ritual: 'Book a ticket or plan a journey', color: 'cyan' },
    { symbol: 'Ship', message: 'Smooth sailing ahead. Your voyage will be peaceful.', ritual: 'Take a different route to work', color: 'cyan' },
    { symbol: 'Road', message: 'The path is clear and safe. Drive forward confidently.', ritual: 'Take a scenic drive today', color: 'cyan' },
    { symbol: 'Bridge', message: 'You are connecting new destinations. Build bridges.', ritual: 'Reach out to someone from another place', color: 'cyan' },
    { symbol: 'Mountain', message: 'High places call to you. Climb to new heights.', ritual: 'Hike or climb something today', color: 'cyan' },
    { symbol: 'Ocean', message: 'Vast opportunities await across the sea. Be adventurous.', ritual: 'Learn about a new culture', color: 'cyan' },
    { symbol: 'Train', message: 'Your journey is steady and reliable. Stay on track.', ritual: 'Follow a routine that serves you', color: 'cyan' },
    { symbol: 'Globe', message: 'The world is your playground. Explore it all.', ritual: 'Learn a few words in a new language', color: 'cyan' }
  ],
  creativity: [
    { symbol: 'Crystal', message: 'Your creative energy is pure and powerful. Express freely.', ritual: 'Create something beautiful today', color: 'purple' },
    { symbol: 'Palette', message: 'Colors flow through you. Paint your world.', ritual: 'Use colors you normally avoid', color: 'purple' },
    { symbol: 'Music Note', message: 'Rhythm and melody inspire you. Make music.', ritual: 'Listen to a new genre of music', color: 'purple' },
    { symbol: 'Quill', message: 'Your words have power. Write your story.', ritual: 'Write 500 words of anything', color: 'purple' },
    { symbol: 'Dance', message: 'Movement expresses your soul. Dance freely.', ritual: 'Move your body to music today', color: 'purple' },
    { symbol: 'Sculpture', message: 'You can shape anything. Mold your reality.', ritual: 'Work with clay or playdough', color: 'purple' },
    { symbol: 'Theater', message: 'You are the star of your life. Perform boldly.', ritual: 'Act out a scene or story', color: 'purple' },
    { symbol: 'Camera', message: 'You see beauty everywhere. Capture it.', ritual: 'Take 10 photos of ordinary things', color: 'purple' },
    { symbol: 'Poetry', message: 'Your soul speaks in verse. Listen and write.', ritual: 'Write a poem about your feelings', color: 'purple' },
    { symbol: 'Design', message: 'You create harmony and beauty. Design your world.', ritual: 'Rearrange a room or space', color: 'purple' }
  ],
  spirituality: [
    { symbol: 'Lotus', message: 'Your spiritual growth is blossoming. Meditate deeply.', ritual: 'Sit in silence for 15 minutes', color: 'indigo' },
    { symbol: 'Moon', message: 'Your intuition is strong. Trust your inner voice.', ritual: 'Journal your dreams and insights', color: 'indigo' },
    { symbol: 'Candle', message: 'Your light guides others. Shine brightly.', ritual: 'Light a candle and meditate', color: 'indigo' },
    { symbol: 'Mandala', message: 'Your energy is balanced and centered. Find peace.', ritual: 'Create or color a mandala', color: 'indigo' },
    { symbol: 'Angel', message: 'Divine guidance surrounds you. Listen carefully.', ritual: 'Ask for guidance before sleep', color: 'indigo' },
    { symbol: 'Chakra', message: 'Your energy centers are aligned. Feel the flow.', ritual: 'Practice chakra meditation', color: 'indigo' },
    { symbol: 'Prayer', message: 'Your prayers are heard. Keep the faith.', ritual: 'Say a prayer of gratitude', color: 'indigo' },
    { symbol: 'Meditation', message: 'Inner peace is your birthright. Claim it.', ritual: 'Meditate on love and light', color: 'indigo' },
    { symbol: 'Sacred Geometry', message: 'Universal patterns guide you. Trust the design.', ritual: 'Study sacred geometry', color: 'indigo' },
    { symbol: 'Divine Feminine', message: 'Your intuitive power is awakening. Embrace it.', ritual: 'Connect with your feminine energy', color: 'indigo' }
  ],
  family: [
    { symbol: 'House', message: 'Your home is filled with love and harmony. Nurture it.', ritual: 'Spend quality time with family today', color: 'orange' },
    { symbol: 'Tree', message: 'Your family roots are strong and deep. Honor them.', ritual: 'Call a family member you haven\'t spoken to', color: 'orange' },
    { symbol: 'Heart', message: 'Love flows freely in your family. Express it.', ritual: 'Tell each family member you love them', color: 'orange' },
    { symbol: 'Bridge', message: 'You are building stronger family bonds. Keep connecting.', ritual: 'Plan a family activity for this week', color: 'orange' },
    { symbol: 'Garden', message: 'Your family is growing beautifully. Water with love.', ritual: 'Plant something together as a family', color: 'orange' },
    { symbol: 'Circle', message: 'Your family circle is complete and whole. Celebrate it.', ritual: 'Have a family dinner or gathering', color: 'orange' },
    { symbol: 'Light', message: 'Your family brings light to the world. Share it.', ritual: 'Help a family member with something', color: 'orange' },
    { symbol: 'Foundation', message: 'Your family foundation is solid. Build upon it.', ritual: 'Create a new family tradition', color: 'orange' },
    { symbol: 'Protection', message: 'Your family is protected and safe. Feel secure.', ritual: 'Create a safe space for your family', color: 'orange' },
    { symbol: 'Growth', message: 'Your family is evolving together. Embrace change.', ritual: 'Learn something new as a family', color: 'orange' }
  ],
  friendship: [
    { symbol: 'Bridge', message: 'You are building strong friendships. Keep connecting.', ritual: 'Reach out to an old friend today', color: 'pink' },
    { symbol: 'Circle', message: 'Your friend circle is expanding. Welcome new people.', ritual: 'Introduce two friends who don\'t know each other', color: 'pink' },
    { symbol: 'Heart', message: 'Your friendships are based on love and trust. Nurture them.', ritual: 'Tell a friend how much they mean to you', color: 'pink' },
    { symbol: 'Light', message: 'You bring light to your friendships. Keep shining.', ritual: 'Help a friend with something today', color: 'pink' },
    { symbol: 'Gift', message: 'Your friendships are precious gifts. Appreciate them.', ritual: 'Give a small gift to a friend', color: 'pink' },
    { symbol: 'Support', message: 'You are a pillar of support for friends. Stay strong.', ritual: 'Listen to a friend without giving advice', color: 'pink' },
    { symbol: 'Loyalty', message: 'Your loyalty to friends is unwavering. Keep your word.', ritual: 'Keep a promise you made to a friend', color: 'pink' },
    { symbol: 'Growth', message: 'Your friendships help you grow. Embrace the journey.', ritual: 'Try something new with a friend', color: 'pink' },
    { symbol: 'Trust', message: 'Trust is the foundation of your friendships. Build it.', ritual: 'Share something personal with a trusted friend', color: 'pink' },
    { symbol: 'Joy', message: 'Your friendships bring joy to your life. Celebrate them.', ritual: 'Plan a fun activity with friends', color: 'pink' }
  ]
}

export class ReadingService {
  static async generateReading(intent: Intent, imageUrl?: string): Promise<ReadingResult> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
    
    // Get readings for the selected intent
    const intentReadings = READING_DATA[intent!] || READING_DATA.luck
    
    // Randomly select one reading
    const randomIndex = Math.floor(Math.random() * intentReadings.length)
    const baseReading = intentReadings[randomIndex]
    
    // Enhance with additional context
    const enhancedReading: ReadingResult = {
      ...baseReading,
      timestamp: new Date(),
      intent,
      imageUrl
    }
    
    return enhancedReading
  }

  static getIntentTitle(intent: Intent): string {
    if (!intent) return 'Загальне'
    
    const titles: Record<string, string> = {
      love: 'Любов',
      money: 'Гроші',
      education: 'Освіта',
      luck: 'Удача',
      health: 'Здоров\'я',
      travel: 'Подорожі',
      creativity: 'Творчість',
      spirituality: 'Духовність',
      family: 'Сім\'я',
      friendship: 'Дружба'
    }
    
    return titles[intent] || 'Загальне'
  }

  static getIntentDescription(intent: Intent): string {
    if (!intent) return 'Загальне пророцтво для вашого дня'
    
    const descriptions: Record<string, string> = {
      love: 'Пророцтво про любов, стосунки та серце',
      money: 'Пророцтво про фінанси, кар\'єру та достаток',
      education: 'Пророцтво про навчання, знання та розвиток',
      luck: 'Пророцтво про удачу та можливості',
      health: 'Пророцтво про здоров\'я та благополуччя',
      travel: 'Пророцтво про подорожі та нові горизонти',
      creativity: 'Пророцтво про творчість та самовираження',
      spirituality: 'Пророцтво про духовність та внутрішній світ',
      family: 'Пророцтво про сім\'ю та домашній затишок',
      friendship: 'Пророцтво про дружбу та соціальні зв\'язки'
    }
    
    return descriptions[intent] || 'Загальне пророцтво для вашого дня'
  }

  static validateImage(imageFile: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (imageFile.size > maxSize) {
      return { isValid: false, error: 'Розмір файлу не може перевищувати 10MB' }
    }
    
    if (!allowedTypes.includes(imageFile.type)) {
      return { isValid: false, error: 'Підтримуються тільки JPEG, PNG та WebP формати' }
    }
    
    return { isValid: true }
  }
}
