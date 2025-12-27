from django.core.management.base import BaseCommand

from tags.models import Tag


class Command(BaseCommand):
    help = "Populate database with sample CRM tags"

    def handle(self, *_args, **_kwargs):
        tags_data = [
            # Lead Tags
            {"name": "hot-lead", "color": "#FF5733"},
            {"name": "cold-lead", "color": "#3498DB"},
            {"name": "qualified", "color": "#2ECC71"},
            {"name": "enterprise", "color": "#9B59B6"},
            {"name": "smb", "color": "#F39C12"},
            {"name": "demo-scheduled", "color": "#E74C3C"},
            # Contact Tags
            {"name": "decision-maker", "color": "#1ABC9C"},
            {"name": "technical", "color": "#34495E"},
            {"name": "influencer", "color": "#E67E22"},
            {"name": "champion", "color": "#16A085"},
            # Deal Tags
            {"name": "high-priority", "color": "#C0392B"},
            {"name": "needs-approval", "color": "#D35400"},
            {"name": "renewal", "color": "#27AE60"},
            {"name": "upsell", "color": "#8E44AD"},
            {"name": "Q1-target", "color": "#2980B9"},
            # General
            {"name": "vip", "color": "#F1C40F"},
            {"name": "urgent", "color": "#E74C3C"},
        ]

        created_count = 0
        for tag_info in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_info["name"], defaults={"color": tag_info["color"]}
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"✓ Created tag: {tag.name} ({tag.color})"))
            else:
                self.stdout.write(f"  Tag already exists: {tag.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Created {created_count} new tags out of {len(tags_data)} total"
            )
        )
