# Generated by Django 3.2.7 on 2021-11-09 22:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('prob', '0004_problemset_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='problemset',
            old_name='type',
            new_name='is_open',
        ),
    ]
