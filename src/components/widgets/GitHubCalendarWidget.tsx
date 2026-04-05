import { GitHubCalendar } from 'react-github-calendar';
import { Card } from '@/components/ui/Card';
import { GITHUB_USERNAME } from '@/data/personal';

export function GitHubCalendarWidget() {
  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Contribuciones
      </h3>

      <div className="overflow-x-auto">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          colorScheme="dark"
          blockSize={11}
          blockMargin={3}
          fontSize={12}
          errorMessage="Límite de peticiones a GitHub excedido temporalmente. Por favor, recarga en unos minutos."
          theme={{
            dark: ['#161B22', '#0e4429', '#006d32', '#26a641', '#2DD4BF'],
          }}
          labels={{
            totalCount: '{{count}} contribuciones en el último año',
          }}
          style={{
            color: 'var(--color-text-secondary)',
          }}
        />
      </div>
    </Card>
  );
}
