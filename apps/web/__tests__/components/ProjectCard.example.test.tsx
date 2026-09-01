/**
 * Example component test for ProjectCard
 * Demonstrates testing React components with Testing Library
 */

import { render, screen, userEvent, generateMockProject } from '../utils/test-helpers';

// Mock component for demonstration
const MockProjectCard = ({ project }: { project: any }) => (
  <div data-testid="project-card">
    <h2>{project.title}</h2>
    <p>{project.description}</p>
    <button>View Project</button>
  </div>
);

describe('ProjectCard Component', () => {
  it('should render project information', () => {
    const project = generateMockProject({
      title: 'Amazing Design',
      description: 'Beautiful design work',
    });

    render(<MockProjectCard project={project} />);

    expect(screen.getByText('Amazing Design')).toBeInTheDocument();
    expect(screen.getByText('Beautiful design work')).toBeInTheDocument();
  });

  it('should display view project button', () => {
    const project = generateMockProject();

    render(<MockProjectCard project={project} />);

    expect(screen.getByRole('button', { name: /view project/i })).toBeInTheDocument();
  });

  it('should render with correct data-testid', () => {
    const project = generateMockProject();

    render(<MockProjectCard project={project} />);

    expect(screen.getByTestId('project-card')).toBeInTheDocument();
  });

  it('should handle click on view project button', async () => {
    const project = generateMockProject();
    const user = userEvent.setup();

    render(<MockProjectCard project={project} />);

    const button = screen.getByRole('button', { name: /view project/i });
    await user.click(button);

    expect(button).toBeInTheDocument();
  });

  it('should display all required project fields', () => {
    const project = generateMockProject({
      title: 'Test Title',
      description: 'Test Description',
      category: 'Design',
    });

    render(<MockProjectCard project={project} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
